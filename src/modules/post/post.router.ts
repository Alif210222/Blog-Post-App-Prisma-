import { Session } from './../../../generated/prisma/client';


import  express, {Request,Response, NextFunction } from 'express';
import { postController } from './post.controller';
import {auth as betterAuth} from "../../lib/auth"

const router = express.Router();

// auth middleware 
const auth = (...roles:any) =>{
      return async (req:Request,res:Response, next:NextFunction) =>{
        // console.log("Middleware calling")
        // console.log(roles);

        // get user session 
        const session = await betterAuth.api.getSession({
            headers:req.headers as any
        })
    
        console.log(session);
        next();
      }
}



router.post("/", auth("ADMIN","USER") , postController.createPost)

export const postRouter = router;