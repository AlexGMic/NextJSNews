import User from "@/model/User";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";
import connectDB from "@/config/connectDB.js";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const { username, password } = credentials;

          if (!username) {
            throw new Error("Username required.");
          }
          if (!password) {
            throw new Error("Password required.");
          }

          await connectDB();

          const findUser = await User.findOne({ username: username });
          if (!findUser) {
            throw new Error("User not registered.");
          }
          if (findUser.status === "inactive") {
            throw new Error("User is restricted from logging into the system");
          }

          const match = await compare(password, findUser?.password);

          if (!match) {
            throw new Error("Invalid username or password");
          }

          const user = {
            id: findUser._id,
            username: findUser?.username,
            role: findUser?.role,
          };
          return user;
        } catch (error) {
          console.error(error, "Error")
          throw new Error(error?.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 1,
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user?.id;
        token.username = user?.username;
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token?.id;
        session.user.username = token?.username;
        session.user.role = token?.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/not-found",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
