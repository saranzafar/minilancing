"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            toast({
                title: "Login Error",
                description: result.error,
                variant: "destructive",
            });
        }
        if (result?.url) {
            router.replace("/dashboard");
        }
        setIsSubmitting(false);
    };

    const handleGithubSignIn = async () => {
        setIsSubmitting(true);
        const result = await signIn("github", { redirect: false });

        if (result?.error) {
            toast({
                title: "GitHub Login Error",
                description: result.error,
                variant: "destructive",
            });
        }
        if (result?.url) {
            router.replace("/dashboard");
        }
        setIsSubmitting(false);
    };

    const handleLinkedInSignIn = async () => {
        setIsSubmitting(true);
        const result = await signIn("linkedin", { redirect: false });

        if (result?.error) {
            toast({
                title: "LinkedIn Login Error",
                description: result.error,
                variant: "destructive",
            });
        }
        if (result?.url) {
            router.replace("/dashboard");
        }
        setIsSubmitting(false);
    };

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        const result = await signIn("google", { redirect: false });

        if (result?.error) {
            toast({
                title: "Google Login Error",
                description: result.error,
                variant: "destructive",
            });
        }
        if (result?.url) {
            router.replace("/dashboard");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-2xl border border-gray-200">
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Welcome back! Log in to continue your freelancing journey.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username or Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username or email"
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
                                            placeholder="Enter your password"
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
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don`&#39;`t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-teal-600 hover:text-teal-500">
                            Create Account
                        </Link>
                    </p>
                </div>

                <div className="mt-4">
                    <Button
                        onClick={handleGithubSignIn}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md shadow-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 focus:outline-none transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In with GitHub"
                        )}
                    </Button>

                    <Button
                        onClick={handleLinkedInSignIn}
                        className="w-full mt-2 bg-blue-700 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-400 focus:outline-none transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In with LinkedIn"
                        )}
                    </Button>

                    <Button
                        onClick={handleGoogleSignIn}
                        className="w-full mt-2 bg-red-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-700 focus:ring-4 focus:ring-red-400 focus:outline-none transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In with Google"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Page;
