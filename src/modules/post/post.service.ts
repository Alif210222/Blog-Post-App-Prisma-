import { SortOrder } from './../../../generated/prisma/internal/prismaNamespaceBrowser';
import { Payload, PostWhereInput } from './../../../generated/prisma/internal/prismaNamespace';
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data : Omit<Post, "id" | "createdAt" | "updatedAt"| "authorId" >, useId:string) =>{
    const result = await prisma.post.create({
        data:{
            ...data,
            authorId:useId
        }
    })
    return result;
}

// Get post Service 
   const getAllPost = async({
    search,tags,isFeatured,status,page,limit,skip,sortBy,sortOrder
    } : {
    search : string | undefined ,
    tags :string[] | [] ,
    isFeatured: boolean | undefined ,
    status : PostStatus | undefined,
    page:number,
    limit:number,
    skip:number,
    sortBy:string ,
    sortOrder:string
}) => {

          const andCondition: PostWhereInput[] = [];

          if(search){
             andCondition.push({
             OR :[ {title:{                               // Condition Apply 
                    contains:search as string,
                    mode : "insensitive"
                }}, 
                       //  search on content 
                {content:{
                    contains:search as string,
                    mode : "insensitive"
                }},
                {
                    tags: {
                        has: search as string 
                    }
                }
              ]
             })
          }

          if(tags.length > 0){
            andCondition.push({
                tags:{
                    hasEvery:tags as string[]
                }
            })
          }


         if(typeof isFeatured === "boolean" ){
            andCondition.push({
                isFeatured
            })
         }

         if(status){
            andCondition.push({
                status
            })
         }

           //-----------------------------------------------      Query
        const allPost = await prisma.post.findMany({
            take:limit,
            skip,
            where:{
              AND:andCondition
            },
            orderBy: {
               [sortBy]:sortOrder  } 
        });

        // Total post count
        const total = await prisma.post.count({
            where:{
                AND:andCondition
            }
        })

        return {
           data : allPost,
           pagination : {
            total,page,limit,
            totalPage: Math.ceil(page/limit)
           }
        };
   }


   // Get Post by id
   const getPostById = async(postId:string)=>{
    return await prisma.$transaction(async(tx)=>{
         // Update View Count 
           await tx.post.update({
              where:{
                id: postId
              },
              data:{
                views:{
                    increment:1
                }
              }
           })


         const result = await tx.post.findUnique({
            where:{
                id:postId
            }
         })
         return result;
    })
         
        //  return result ;

      // console.log("Get Post By id ")
   }


export const postService ={
       createPost,
       getAllPost,
       getPostById
}