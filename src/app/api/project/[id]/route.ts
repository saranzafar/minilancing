import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ProjectModel } from "@/model/User";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";



export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    console.log("DELETE api called");

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'No project ID provided' },
                { status: 400 }
            );
        }

        const project = await ProjectModel.findOneAndDelete({ _id: id, userId: _user._id });

        if (!project) {
            return NextResponse.json(
                { success: false, message: 'Project not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Project deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error while deleting the project:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error while deleting the project',
            },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    console.log("get single project API called");

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return NextResponse.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const id = params.id;
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid or missing project ID' },
                { status: 400 }
            );
        }

        const project = await ProjectModel.findOne({ _id: id, userId: _user._id });

        if (!project) {
            return NextResponse.json(
                { success: false, message: 'Project not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Project fetched',
                project // Consider returning only necessary fields
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error while fetching the project:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error while fetching the project. Please try again later.',
            },
            { status: 500 }
        );
    }
}
