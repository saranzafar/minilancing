"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Page() {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback((value: string) => setUsername(value), 300);
    const { toast } = useToast();
    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            userType: "client",
        },
    });


    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(`/api/check-username-unique/?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUniqueness();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            toast({
                title: "Sign up successful",
                description: response.data.message,
            });

            router.replace(`/verify/${data.username}`);
        } catch (error) {
            console.error("Error signing up user: ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Error signing up",
                description: errorMessage ?? "Error signing up",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-2xl border border-gray-200">
                <div className="text-center mb-4">
                    <h2 className="text-4xl font-bold text-gray-800">Create Your Account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Join us and start your journey.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Choose a username"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && (
                                        <Loader2 className="animate-spin text-teal-500 inline-block ml-2" />
                                    )}
                                    <p
                                        className={`text-sm mt-1 ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Create a password"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Dropdown for User Type */}
                        <FormField
                            control={form.control}
                            name="userType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Join Mini-lancing As?</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="freelancer">Freelancer</SelectItem>
                                                <SelectItem value="client">Client</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-400 focus:outline-none transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                    Signing Up...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="font-semibold text-teal-600 hover:text-teal-500">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;
