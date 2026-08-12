import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { GoogleGenAI } from "@google/genai"
import axios from "axios"
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../model/Generation.js";
import { Post } from "../model/Post.js";


// Generate Post
// POST /api/posts/generate
export const generatePost = async(req:AuthRequest,res:Response):Promise<void>=>{
    try{
        const {prompt,tone,generateImage}= req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if(!apiKey){
            res.status(400).json({message:"Gemini API KEY is missing. Please add it to your server/.env file"});
            return;
        }

        const ai = new GoogleGenAI({apiKey});

        // Generate Text
        const textResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents:`Generate a social media post based on this prompt : "${prompt}.
            Tone:${tone}.
            Include Relevant hashtags.
            Format the response as JSON with "content" and "imagePrompt" fields.
            The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post. `
        })
        
        let content="";
        let imagePrompt = prompt;
        try{
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {content:rawText, imagePrompt: prompt};
            content = data.content;
            imagePrompt = data.imagePrompt;

        }
        catch(e){
            content = textResponse.text || ""
        }

        let mediaUrl = "";
        if(generateImage){
            try{
                const pollinationsKey = process.env.POLLINATIONS_API_KEY;

                if (!pollinationsKey) {
                    throw new Error("Pollinations API key is missing");
                }

                const encodedPrompt = encodeURIComponent(imagePrompt);

                const imageUrl =`https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=1024`;

                const imageResponse = await axios.get(imageUrl, {
                    headers: {
                        Authorization: `Bearer ${pollinationsKey}`
                    },
                    responseType: "arraybuffer"
                });

                const uploadResult = await new Promise<any>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "ai-generations",
                            resource_type: "image"
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );

                    stream.end(Buffer.from(imageResponse.data));
                });

                mediaUrl = uploadResult.secure_url;
            }
            catch (err: any) {
                console.error("Image Generation failed:", err);

                throw new Error(
                    err?.message || "Image generation failed"
                );
            }
        }

        // Save generation to DB
        const generation = await Generation.create({
            user:req.user._id,
            prompt,
            content,
            mediaUrl,
            mediaType:mediaUrl ? "image" : undefined,
            tone
        })
        res.json(generation)
    }
    catch (error:any) {
        console.error("generatePost:", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

// Get generations
// GET /api/posts/generations
export const getGenerations = async(req:AuthRequest,res:Response):Promise<void>=>{
  try{
        const generations = await Generation.find({user:req.user._id}).sort({createdAt:-1})
        res.json(generations)
    }
    catch (error:any) {
        console.error("generatePost:", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

// Get posts
// GET /api/posts
export const getPosts = async(req:AuthRequest,res:Response):Promise<void>=>{
    try{
        const posts = await Post.find({user:req.user._id});
        res.json(posts);
       
    }
    catch (error:any) {
        console.error("generatePost:", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

// Schedule posts
// POST /api/posts
export const schedulePost = async(req:AuthRequest,res:Response):Promise<void>=>{
    try{
        const {content,platforms,scheduledFor,status} = req.body;

        // Parse platorms if it comes as a stringified array from FormData
        let parsedPlatforms = platforms;
        if(typeof platforms === "string"){
            try{
                parsedPlatforms = JSON.parse(platforms)
            }
            catch(e){
                parsedPlatforms = platforms.split(",");
            }
        }
        let mediaUrl : string|undefined = req.body.mediaUrl;
        let mediaType : "image"|"video"|undefined = req.body.mediaType;

        if(req.file){
            const result = await new Promise<any>((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream({resource_type:"auto",folder:"social-scheduler"},(error,result)=>{
                    if(error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file!.buffer);
            });
            mediaUrl = result.secure_url;
            mediaType = result .resource_type === "video" ? "video" : "image";
        }
        const post = await Post.create({
            user:req.user._id,
            content,
            platforms:parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status
        })
        res.status(201).json(post)
    }
    catch (error:any) {
        console.error("generatePost:", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}