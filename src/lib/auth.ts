import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
         additionalFields:{
            role:{
                type:"string",
                defaultValue:"USER",
                required:false
            },
            phone:{
                type:"string",
                required:false
            },
            status:{

                type: "string",
                defaultValue:"ACTIVE",
                required: false
            }
         }
    },
     emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification:true
  },
  emailVerification:{
    sendVerificationEmail:async ({user,url,token},request) =>{
        console.log("****** Verificstion email send !")
    }
  }
});