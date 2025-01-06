"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { projectSchema } from "@/schemas/projectSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import generateDescription from "@/helpers/generateDescription";
import { Skeleton } from "@/components/ui/skeleton";

function Client() {
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAiButton, setShowAiButton] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            details: "",
            amount: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof projectSchema>) => {
        setIsUploading(true);
        try {
            await axios.post("/api/project", data);
            toast({ title: "Success", description: "Project uploaded successfully!" });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? "Failed to upload project",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const titleWords = form.watch("title").trim().split(" ");
        setShowAiButton(titleWords.length >= 3);
    }, [form.watch("title")]);

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        const title = form.getValues("title");

        try {
            const result = await generateDescription(title);
            if (result.success) {
                form.setValue("details", result.description);
                toast({ title: "Description generated successfully!" });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Failed to generate description", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full p-10 rounded-lg border border-gray-200">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Upload Project</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter project title"
                                            required
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showAiButton && (
                            <Button
                                onClick={handleGenerateDescription}
                                type="button"
                                variant="ghost"
                                className="absolute top-12 right-0 flex items-center space-x-2 bg-teal-600 text-white py-2 px-3 rounded-md shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-400"
                            >
                                <Wand2 className="h-5 w-5" />
                                <span>Generate Description</span>
                            </Button>
                        )}

                        <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Details</FormLabel>
                                    <FormControl>
                                        {isGenerating ? (
                                            <Skeleton className="h-24 w-full rounded-md" />
                                        ) : (
                                            <Textarea
                                                placeholder="Enter project details"
                                                required
                                                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                                {...field}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="string"
                                            required
                                            placeholder="Enter Your Budget"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full text-right">
                            <Button
                                type="submit"
                                className="w-[8rem] bg-teal-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-400 focus:outline-none transition"
                                disabled={isUploading || isGenerating}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                        Upload
                                    </>
                                ) : (
                                    "Upload Project"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Client;
