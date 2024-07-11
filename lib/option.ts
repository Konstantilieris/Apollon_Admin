import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AdminModel from "@/database/models/admin.model";
import { connectToDatabase } from "@/lib/mongoose";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1800,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET as string,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { name, password } = credentials as {
          name: string;
          password: string;
        };
        await connectToDatabase();
        const admin = await AdminModel.findOne({ name });
        if (!admin) throw Error("admin not found");
        if (admin.role !== "admin") {
          throw Error("User is not an admin");
        }

        const passwordMatch = await admin.comparePassword(password);
        if (!passwordMatch) throw Error("passwords dont match");
        return {
          name: admin.name,
          id: admin._id,
          role: admin.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt(params: any) {
      if (params.admin?.name) {
        params.token.name = params.admin.name;
        params.token.id = params.admin._id;
        params.token.role = params.admin.role;
      }
      // return final token
      return params.token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { name: string }).name = token.name as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};
