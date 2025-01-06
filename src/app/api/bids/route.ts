import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { ProjectModel } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401 }
        );
    }
    console.log("USER : ", _user);
    try {
        const { projectId, bid } = await request.json();

        if (!projectId || !bid) {
            return new Response(
                JSON.stringify({ success: false, message: 'Please provide bid and projectId' }),
                { status: 400 }
            );
        }

        // Find the project by its ID
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return new Response(
                JSON.stringify({ success: false, message: 'Project not found' }),
                { status: 404 }
            );
        }

        // Check if the user already posted a bid for this project
        const userHasBid = project.bids.some(b => b?.userId?.toString() === _user._id);
        if (userHasBid) {
            return new Response(
                JSON.stringify({ success: false, message: 'You have already placed a bid for this project' }),
                { status: 409 }
            );
        }

        // Add bid to the project's bids array
        project.bids.push({
            bid: bid,
            userId: _user._id,
            username: _user.username || "Anonymous",
            createdAt: new Date(),
        });

        // Save the updated project with the new bid
        await project.save();

        return new Response(
            JSON.stringify({ success: true, message: 'Bid added successfully' }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding bid:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error adding bid' }),
            { status: 500 }
        );
    }
}

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        // Fetch projects where bids array has an entry with userId matching the current user
        const fetchedProjects = await ProjectModel.find({
            bids: { $elemMatch: { userId: _user._id } }
        });

        if (!fetchedProjects?.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No projects found for this user',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Projects with user bids fetched successfully',
                projects: fetchedProjects,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error while fetching projects:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error while fetching projects',
            },
            { status: 500 }
        );
    }
}



