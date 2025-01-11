"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for the project and bids
interface Bid {
    createdAt: string | number | Date;
    username: string;
    userId: string;
    bid: string;
}

interface Project {
    _id: string;
    title: string;
    details: string;
    amount: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    bids: Bid[];
}

const Page = () => {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const { toast } = useToast();
    const [accountType, setAccountType] = useState<string | null>(null);
    const [bidSubmitting, setBidSubmitting] = useState(false);
    const [bidText, setBidText] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/project/${id}`);
                    console.log("REsponse: ", response.data);

                    setProject(response.data.project);
                } catch (error) {
                    console.error("Error fetching project data:", error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch project data.",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchProject();
    }, [id, toast]);

    const handleDelete = async () => {
        if (!project) return;
        try {
            const response = await axios.delete(`/api/project/${project._id}`);
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Project deleted successfully.",
                    variant: "default",
                });
                window.location.href = '/projects';
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "Failed to delete project.",
                variant: "destructive",
            });
        }
    };

    const fetchUserType = async () => {
        try {
            const response = await axios.get("/api/profile");
            if (response.status === 200) {
                setAccountType(response.data.userType);
            }
        } catch (error) {
            console.error("Error fetching user type:", error);
            toast({
                title: "Error",
                description: "Failed to fetch user type.",
                variant: "default",
            });
        }
    };

    useEffect(() => {
        fetchUserType();
    }, []);

    if (!project) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (bidText.trim().length < 5) {
            toast({
                title: "Error",
                description: "Bid must be at least 5 characters long.",
                variant: "destructive",
            });
            return;
        }

        setBidSubmitting(true);
        try {
            const response = await axios.post(`/api/bids`, {
                projectId: id,
                bid: bidText,
            });
            console.log("RESPONSE: ", response.data);
            toast({
                title: "Success",
                description: response.data?.message || "Bid submitted successfully.",
                variant: "default",
            });
            setBidText("");

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Handle AxiosError specifically
                console.error("Axios Error submitting bid:", error);
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to submit bid.",
                    variant: "destructive",
                });
            } else {
                // Handle other unknown errors
                console.error("Unknown Error submitting bid:", error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        } finally {
            setBidSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 mb-20">
            <Card className="w-full max-w-4xl mt-10 divide-y divide">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.details}</p>
                    <p className="text-lg font-semibold mt-2">Amount: ${project.amount}</p>
                    {accountType === "client" && (
                        <div className="w-full text-right">
                            <Button
                                onClick={handleDelete}
                                className="mt-4 border border-red-600 bg-transparent text-red-600 hover:bg-red-50"
                            >
                                Delete Project
                            </Button>
                        </div>
                    )}
                </CardHeader>
            </Card>

            {accountType === "client" ? (
                <Card className="w-full max-w-4xl mt-10 divide-y divide">
                    <CardContent>
                        <h2 className="text-xl font-semibold mt-4 mb-4">Bids</h2>
                        {project?.bids && project.bids?.length > 0 ? (
                            project.bids.map((bid, index) => (
                                <div key={index} className="border p-4 my-2 rounded-md shadow-sm space-y-2">
                                    <p className="font-bold">{bid.username}</p>
                                    <p className="text-sm">Bid Detail: {bid.bid}</p>
                                    <p className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                    <div className="w-full text-right">
                                        <Button
                                            className="bg-teal-600 text-white hover:bg-teal-700"
                                            onClick={() => router.push("/chat")}
                                        >Discuss</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No bids available for this project.</p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className='w-[56rem] mt-16 border-t-2 pt-10'>
                    <div className='flex justify-between my-4 px-4'>
                        <div className='flex flex-col justify-center items-center'>
                            <h2 className='text-xl font-bold'>Write Bid</h2>
                            <span className='text-sm'>Concise & eye-catching</span>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <span className='text-xl font-bold'>{project.bids.length} Bid(s)</span>
                            <span className='text-sm'>Placed on this Project</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmitBid} className="space-y-6 text-right">
                        <Textarea
                            placeholder="Describe your bid here"
                            className="resize-none"
                            value={bidText}
                            onChange={(e) => setBidText(e.target.value)}
                        />
                        <Button
                            disabled={bidSubmitting}
                            type="submit"
                            className='bg-teal-600 hover:bg-teal-700'
                        >
                            {bidSubmitting ? <Loader2 className="mr-2 animate-spin" /> : "Submit Bid"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Page;
