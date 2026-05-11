import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/connectDB";
import User from "./model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
    await connectDb();

    const email = credentials?.email as string;
    const password = credentials?.password as string;

    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
       console.log("No user found");
       return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log("Password mismatch");
        return null;
    }

    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
    };
},
        }),
        Google({
            clientId:process.env.AUTH_GOOGLE_ID,
            clientSecret:process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {

        async signIn({ user, account }) {

    try {
        if (account?.provider === "google") {

            await connectDb();

            let DBUser = await User.findOne({ email: user.email });

            if (!DBUser) {

                DBUser = await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    authProvider: "google"
                });

            }

            user.id = DBUser._id.toString();
            user.role = DBUser.role?.toString();

        }

        return true;

    } catch (error) {
        return false;
    }
},

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
});