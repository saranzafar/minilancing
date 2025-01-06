import dbConnect from "@/lib/dbConnect";
import { ProjectModel } from "@/model/User"
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect();
    console.log("project API CALLED");
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const { title, details, amount } = await request.json();

        const createdProject = new ProjectModel({
            title,
            details,
            amount,
            userId: _user._id
        })
        await createdProject.save();

        return Response.json(
            {
                success: true,
                message: 'Project Uploaded successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding project:', error);
        return Response.json(
            {
                success: false,
                message: 'Error uploading project',
            },
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
        const fetchedProjects = await ProjectModel.find({ userId: _user._id });

        if (!fetchedProjects?.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No projects found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Projects fetched successfully',
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