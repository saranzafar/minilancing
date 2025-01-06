import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        // Parse incoming request body
        const { username, email, password, userType } = await request.json();

        // Check if username is already taken
        const existingUserByUsername = await UserModel.findOne({ username });
        if (existingUserByUsername && existingUserByUsername.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }

        // Check if email is already taken
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400 }
                );
            } else {
                // If email exists but not verified, update password and verification code
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
                await existingUserByEmail.save();
            }
        } else {
            // Create new user if no email found
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour for verification expiry

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                accountType: userType,
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Sign up successful. Please check your email to verify your account.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during user sign-up: ", error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error during sign-up process',
            },
            { status: 500 }
        );
    }
}
