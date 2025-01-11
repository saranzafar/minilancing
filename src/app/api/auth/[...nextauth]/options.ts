import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";

interface User {
    id: string; // Changed from `_id` to `id` to match NextAuth's expectation
    isVerified: boolean;
    username: string;
    userType: string;
    password: string; // Used internally, excluded from JWT and session
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<Omit<User, "password"> | null> {
                if (!credentials) {
                    throw new Error("Missing credentials");
                }

                const { identifier, password } = credentials;

                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier },
                        ]
                    });

                    if (!user) {
                        throw new Error('No user found with this email or username');
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    // Check if the provided password matches the hashed password in the database
                    const isPasswordCorrect = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (isPasswordCorrect) {
                        // Exclude password from the returned user object
                        return {
                            id: user._id.toString(),
                            isVerified: user.isVerified,
                            username: user.username,
                            userType: user.userType,
                        };
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (err) {
                    throw new Error((err as Error).message);
                }
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.userType = user.userType;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.userType = token.userType;
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/sign-in',
    },
};
