import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/middleware";

async function seedAdmin(){
     try {
        console.log("**Admin seeding started ....")
        const adminData = {
              name: "Admin1 Mirza",
              email:"admin1@gmail.com",
              role:UserRole.ADMIN,
              password:"admin1234"
        }


        console.log("****Checking admin exist or not ")
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


        //console.log(signUpAdmin)

        if(signUpAdmin.ok){
            console.log("*****Admin created")
            await prisma.user.update({
                where:{
                    email:adminData.email
                },
                data:{
                    emailVerified:true
                }
            })
            console.log("*******Email Verified updated !!")
        }
        console.log("Verified Successful !")
        
     } catch (error) { 
        console.error(error)
        
     }
}

seedAdmin();