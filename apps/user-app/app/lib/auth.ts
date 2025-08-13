// import db from "@repo/db/client";
// import CredentialsProvider from "next-auth/providers/credentials"
// import bcrypt from "bcrypt";

// export const authOptions = {
//     providers: [
//       CredentialsProvider({
//           name: 'Credentials',
//           credentials: {
//             phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
//             password: { label: "Password", type: "password", required: true }
//           },
//           // TODO: User credentials type from next-aut
//           async authorize(credentials: any) {
//             // Do zod validation, OTP validation here
//             const hashedPassword = await bcrypt.hash(credentials.password, 10);
//             const existingUser = await db.user.findFirst({
//                 where: {
//                     number: credentials.phone
//                 }
//             });

//             if (existingUser) {
//                 const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
//                 if (passwordValidation) {
//                     return {
//                         id: existingUser.id.toString(),
//                         name: existingUser.name,
//                         email: existingUser.number
//                     }
//                 }
//                 return null;
//             }

//             try {
//                 const user = await db.user.create({
//                     data: {
//                         number: credentials.phone,
//                         password: hashedPassword
//                     }
//                 });
            
//                 return {
//                     id: user.id.toString(),
//                     name: user.name,
//                     email: user.number
//                 }
//             } catch(e) {
//                 console.error(e);
//             }

//             return null
//           },
//         })
//     ],
//     secret: process.env.JWT_SECRET || "secret",
//     callbacks: {
//         // TODO: can u fix the type here? Using any is bad
//         async session({ token, session }: any) {
//             session.user.id = token.sub

//             return session
//         }
//     }
//   }
  

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@repo/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const existingUser = await db.user.findFirst({
          where: { number: credentials.phone }
        });

        if (existingUser) {
          const isValid = await bcrypt.compare(credentials.password, existingUser.password);
          if (!isValid) return null;

          return {
            id: existingUser.id.toString(),
            name: existingUser.name ?? undefined,
            email: existingUser.number
          };
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const user = await db.user.create({
          data: {
            number: credentials.phone,
            password: hashedPassword
          }
        });

        return {
          id: user.id.toString(),
          name: user.name ?? undefined,
          email: user.number
        };
      }
    })
  ],
  secret: process.env.JWT_SECRET ?? "secret",
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
  
};
