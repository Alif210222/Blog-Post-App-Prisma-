import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/middleware";

async function seedAdmin(){
     try {
        const adminData = {
              name: "Admin Mirza",
              email:"admin@gmail.com",
              role:UserRole.ADMIN,
              password:"admin1234"
        }

        const existingUser = await prisma.user.findUnique({
            where :{
                email:adminData.email
            }
        })

        // condition 
        if(existingUser){
            throw new Error("User already exists !!!")
        }

        const signUpAdmin = await fetch ("http://localhost:3000/api/auth/sign-up/email", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(adminData)
        })
        
     } catch (error) {
        console.error(error)
        
     }
}