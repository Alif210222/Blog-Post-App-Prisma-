// create a postController function

import { Request ,Response} from "express"
import { postService } from "./post.service"


const createPost = async (req:Request, res:Response) =>{
     try {
       // console.log(req.user)
        if(!req.user){
          return  res.status(400).json({
            error:"Unauthorized",
            })
        }


        const result = await postService.createPost(req.body,req.user.id)
        res.status(201).json({result})
     } catch (error) {
        console.log(error)
        res.status(400).json({
            error:"post creation failed",
            details : error,
           
        })
     }
}

export const postController = {
    createPost
}