// import cron from "node-cron";
import { Post } from "../model/Post.js";
import { Account } from "../model/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../model/ActivityLog.js";
export const processScheduledPosts = async () => {
    try {
        const now = new Date();
        while (true) {
            // Atomically claim ONE scheduled post
            const post = await Post.findOneAndUpdate({ status: "scheduled", scheduledFor: { $lte: now } }, { $set: { status: "publishing" } }, { new: true });
            // No more scheduled posts
            if (!post) {
                break;
            }
            try {
                const accounts = await Account.find({
                    user: post.user,
                    platform: { $in: post.platforms },
                    status: "connected",
                    zernioAccountId: { $exists: true }
                });
                console.log("MATCHED ACCOUNTS:", accounts.length);
                if (accounts.length === 0) {
                    console.log(`No connected Zernio accounts found for post ${post._id}`);
                    post.status = "failed";
                    try {
                        await post.save();
                    }
                    catch (saveError) {
                        console.error(`Failed to save failed status for post ${post._id}:`, saveError);
                    }
                    continue;
                }
                const zernioPlatforms = accounts.map((acc) => ({
                    platform: acc.platform,
                    accountId: acc.zernioAccountId
                }));
                const payload = {
                    content: post.content,
                    publishNow: true,
                    ...(post.mediaUrl
                        ? {
                            mediaItems: [{
                                    type: post.mediaType || "image",
                                    url: post.mediaUrl
                                }
                            ]
                        }
                        : {}),
                    platforms: zernioPlatforms
                };
                console.log(`Publishing post ${post._id} to Zernio with media: ${post.mediaUrl || "none"}`);
                const response = await zernio.posts.createPost({ body: payload });
                const publishedPost = response.data?.post || response.data;
                if (!publishedPost) {
                    throw new Error("Failed to get post object from Zernio response");
                }
                console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);
                // Mark as published
                post.status = "published";
                await post.save();
                // Activity log
                try {
                    await ActivityLog.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
                        relatedPosts: post._id
                    });
                }
                catch (logError) {
                    console.error("Activity log failed:", logError);
                }
            }
            catch (err) {
                console.error(`Failed to publish post ${post._id}:`, err.response?.data || err.message);
                // Mark post as failed
                post.status = "failed";
                try {
                    await post.save();
                }
                catch (saveError) {
                    console.error(`Failed to save failed status for post ${post._id}:`, saveError);
                }
            }
        }
        console.log(`Scheduler finished checking posts at ${now.toISOString()}`);
    }
    catch (error) {
        console.error("Error in scheduler:", error);
        // Important: don't hide scheduler-level errors
        throw error;
    }
};
// Vercel cron will call the API endpoint.
// Local node-cron is intentionally disabled.
// export const initScheduler = () => {
//     cron.schedule("* * * * *", async () => {
//         console.log("⏰ Scheduler checking scheduled posts...");
//         await processScheduledPosts();
//     });
//
//     console.log("✅ Scheduler service initialized");
// };
