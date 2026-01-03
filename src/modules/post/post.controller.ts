// create a postController function

import { Request ,Response} from "express"
import { postService  } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums"


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

//Get All POST CONTROLER 
  const getAllPost =async (req:Request,res:Response) =>{
        try {
              const {search} = req.query;
              //console.log("search value:", search)
              const searchString = typeof search === "string" ? search : undefined;
              const tags = req.query.tag ? (req.query.tag as string).split(",") : []; 
              const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" : undefined ;
              const status = req.query.status as PostStatus | undefined


             // console.log(isFeatured)

              const result = await postService.getAllPost({search : searchString , tags, isFeatured,status})
              res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({
            error:" post get failed !",
            details : error,
           
        })
        }
  }



export const postController = {
    createPost,
    getAllPost
}