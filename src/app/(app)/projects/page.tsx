"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // CSS for DatePicker
import { useRouter } from "next/navigation";

// Define a type for project
interface Project {
    _id: string;
    title: string;
    details: string;
    amount: string;
    updatedAt: string;
}

export default function ViewProjects({ title, primaryBtn }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const router = useRouter()

    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            try {
                const response = await axios.get("/api/project");
                const sortedProjects = response.data.projects.sort(
                    (a: Project, b: Project) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setProjects(sortedProjects);
                setFilteredProjects(sortedProjects);
                toast({
                    title: "Success",
                    description: response?.data?.message || "Projects fetched successfully",
                    variant: "default",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch projects.",
                    variant: "destructive",
                });
            }
            setIsLoading(false);
        }
        fetchProjects();
    }, [toast]);

    useEffect(() => {
        let filtered = projects;

        if (searchTerm) {
            filtered = filtered.filter((project) =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter((project) => {
                const projectDate = new Date(project.updatedAt);
                return projectDate >= startDate && projectDate <= endDate;
            });
        }

        setFilteredProjects(filtered);
    }, [searchTerm, startDate, endDate, projects]);

    const handleDelete = async (id: string) => {
        setIsDeleting(true)
        try {
            await axios.delete(`/api/project/${id}`);
            setProjects(projects.filter((project) => project._id !== id));
            toast({
                title: "Success",
                description: "Project deleted successfully.",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete project.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false)
        }
    };
    const handleSeeMore = async (id: string) => {
        router.push(`/projects/${id}`)
    }
    
    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{title ? title : "Your Projects"}</h2>

                {/* Filters Section */}
                <div className="mb-6 flex space-x-4 items-end">
                    <Input
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <label htmlFor="starting-date">Start Date

                        <DatePicker
                            id="starting-date"
                            placeholder="Start Date"
                            selected={startDate}
                            onSelect={(date) => setStartDate(date)}
                            className="border shadow-sm rounded"
                        />
                    </label>
                    <label htmlFor="end-date">End Date
                        <DatePicker
                            id="end-date"
                            placeholder="End Date"
                            selected={endDate}
                            onSelect={(date) => setEndDate(date)}
                            className="border shadow-sm rounded"
                        />
                    </label>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    </div>
                ) : filteredProjects?.length === 0 ? (
                    <p className="text-gray-500">No projects found.</p>
                ) : (
                    <div className="space-y-6">
                        {filteredProjects?.map((project) => (
                            <Card key={project._id} className="shadow-md p-6">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {project.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        Posted on: {new Date(project.updatedAt).toLocaleDateString()}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-2">{project.details}</p>
                                    <p className="text-teal-600 font-medium mb-4">
                                        Budget: ${project.amount}
                                    </p>
                                    <div className="text-right gap-4 space-x-5">
                                        {primaryBtn ? (
                                            <Button
                                                variant="default"
                                                disabled={isDeleting}
                                                className="bg-teal-600 hover:bg-teal-700"
                                                onClick={() => handleSeeMore(project._id)}
                                            >
                                                Bid now
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    disabled={isDeleting}
                                                    className="border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600"
                                                    onClick={() => handleDelete(project._id)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    disabled={isDeleting}
                                                    className="bg-teal-600 hover:bg-teal-700"
                                                    onClick={() => handleSeeMore(project._id)}
                                                >
                                                    See more
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
