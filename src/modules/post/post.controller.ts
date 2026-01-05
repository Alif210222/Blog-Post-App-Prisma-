import { SortOrder } from './../../../generated/prisma/internal/prismaNamespaceBrowser';
// create a postController function

import { Request ,Response} from "express"
import { postService  } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums"
import paginationSortingHelper from '../../helper/paginationSortingHelper';


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
              // const page =Number(req.query.page ?? 1)
              // const limit = Number(req.query.limit ?? 10)
              // const skip = ( page - 1) * limit
              // const sortBy = req.query.sortBy as string | undefined
              // const sortOrder = req.query.SortOrder as string | undefined

              const options = paginationSortingHelper(req.query);
             // console.log(options); 
             // console.log(isFeatured)

             const {page,limit,skip,sortBy,sortOrder} = options;
              const result = await postService.getAllPost({search : searchString , tags, isFeatured,status,page,limit,skip,sortBy,sortOrder})
              res.status(200).json(result)

        } catch (error) {
            console.log(error)
            res.status(400).json({
            error:" post get failed !",
            details : error,
           
        })
        }
  }

  //Get Post By id 
  const getPostById = async(req:Request,res:Response)=>{
        try {
          const {postId}  = req.params
          //console.log({postId})

          if(!postId){
            throw new Error("Post id is required !")
          }

          const result = await postService.getPostById(postId)
          res.status(200).json(result);
        } catch (error) {
          res.status(400).json({
            error:" Get post by is id  failed !",
            details : error,
          })
        }
        
  }


export const postController = {
    createPost,
    getAllPost,
    getPostById
}