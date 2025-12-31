import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"




// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});


// better auth configaretion
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



  // email verification
 emailVerification: {

    sendOnSignUp:true,
    autoSignInAfterVerification:true, 
    
    sendVerificationEmail: async ( { user, url, token }, request) => {
        //console.log(user, url, token)
    try {
                 const verificationUrl = `${process.env.App_url}/verify-email?token=${token}`
     const info = await transporter.sendMail({
    from: '"Prisma Client" <maddison53@ethereal.email>',
    to: user.email,
    subject: "Please verify your email!",
    text: "Hello world?", // Plain-text version of the message
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      padding: 24px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 32px;
      color: #333333;
      line-height: 1.6;
      font-size: 15px;
    }
    .button-wrapper {
      text-align: center;
      margin: 28px 0;
    }
    .button {
      background: #4f46e5;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }
    .link {
      word-break: break-all;
      color: #4f46e5;
      font-size: 14px;
    }
    .footer {
      background: #f1f5f9;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Email Verification
    </div>

    <div class="content">
      <p>Hi 👋 ${user.name}</p>

      <p>
        Thanks for creating an account. Please verify your email address by
        clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="button">Verify Email</a>
      </div>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">${url}</p>

      <p>
        If you didn’t create this account, you can safely ignore this email.
      </p>

      <p>
        Best regards,<br />
        Blog Post Team
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
    </div>
  </div>
</body>
</html>
`, // HTML version of the message
 

  });
    console.log("Message Sent : ",info.messageId)

  }catch (error) {
    console.error(error)     
      }

      

    },
  },

  //Social Provider
  socialProviders: {
        google: { 
          prompt:"select_account consent",
          accessType:"offline", // for re-freash token
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 

        }, 
    },
});