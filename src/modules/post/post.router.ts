// import { Request } from 'express';



import  express, {Request,Response, NextFunction } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/middleware';


const router = express.Router();







router.post("/", auth(UserRole.USER) , postController.createPost)

export const postRouter = router;