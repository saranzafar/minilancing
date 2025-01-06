import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";


export async function POST() {
    await dbConnect();
    console.log("Toggle Account Type API Called");

    const session = await getServerSession(authOptions);
    const _user = session?.user;
    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }

    try {
        const user = await UserModel.findById(_user._id);
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        console.log("user.accountType: ", user.userType);
        const newAccountType = user.userType == "client" ? "freelancer" : "client";
        console.log("NEW ACCOUNT: ", newAccountType);

        user.userType = newAccountType;
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Account type updated successfully",
                userType: newAccountType,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error toggling account type:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error updating account type" }),
            { status: 500 }
        );
    }
}

// GET route for fetching userType
export async function GET() {
    await dbConnect();
    console.log("Fetch User Type API Called");

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }

    try {
        const user = await UserModel.findById(_user._id);
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        const userType = user.userType;

        return new Response(
            JSON.stringify({
                success: true,
                userType: userType,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user type:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error fetching user type" }),
            { status: 500 }
        );
    }
}
