
import  express, {Request,Response, NextFunction } from 'express';
import {auth as betterAuth} from "../lib/auth"


// Create a global role type 
export enum UserRole{
    USER="USER",
    ADMIN="ADMIN"
}


// Create a global user type 
declare global {
      namespace Express{
        interface Request{
            user?:{
               id:string,
               name:string,
               email:string,
               role:string,
               emailVerification:boolean 
            }
        }
      }
}

// auth middleware 
const auth = (...roles: UserRole[]) =>{
      return async (req:Request,res:Response, next:NextFunction) =>{
        // console.log("Middleware calling")
        // console.log(roles);

        // get user session 
        const session = await betterAuth.api.getSession({
            headers:req.headers as any
        })
        // console.log(session);

        if(!session){
            return res.status(401).json ({
                success: false ,
                message: "You are not authorized !"
            })
        };

        // if email not verified
         if(!session.user.emailVerified){
            return res.status(403).json ({
                success: false ,
                message: "Email not verified !"
            })
        };
        
        // Save the user info in request 
        const userInfo = session.user;
        req.user = {
            id:userInfo.id,
            name:userInfo.name,
            email:userInfo.email,
            role:userInfo.role as string,
            emailVerification:userInfo.emailVerified
        }


        // cheack user role 
        if(roles.length && !roles.includes(req.user.role as UserRole)){
             return res.status(403).json ({
                success: false ,
                message: "Forbidden !! You don't have permission to access this  resources" 
            })
        }
        

        next();
      }
}

export default auth;