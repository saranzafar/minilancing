"use client";

import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from 'axios';
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


function Page() {
    const route = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zod form implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code
            });
            toast({
                title: "Verification successful",
                description: "Your account has been verified",
            });
            route.replace("/sign-in");

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.log("Verification code error");

            toast({
                title: "Error verifying code",
                description: axiosError.response?.data.message,
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
                    <h2 className="text-3xl font-bold text-gray-800">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Please enter the verification code sent to your email.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your code"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
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
                                    Verifying...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Didn’t receive the code?{" "}
                        <a href="/signup" className="font-semibold text-teal-600 hover:text-teal-500">
                            Resend Code
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;
