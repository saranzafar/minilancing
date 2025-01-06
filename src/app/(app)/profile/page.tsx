"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const UserProfile = () => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [accountType, setAccountType] = useState("client");

    // Fetch userType on component mount
    const fetchUserType = async () => {
        try {
            const response = await axios.get("/api/profile");
            if (response.status === 200) {
                setAccountType(response.data.userType);
            }
        } catch (error) {
            console.error("Error fetching user type:", error);
            toast({
                title: "Success",
                description: "Error while fetching user type",
                variant: "default",
            });
        }
    };

    useEffect(() => {
        fetchUserType();
    }, []);

    const toggleAccountType = async () => {
        try {
            const response = await axios.post("/api/profile");

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Account switched successfully.",
                    variant: "default",
                });
                fetchUserType()

                window.location.reload()
            } else {
                toast({
                    title: "Error",
                    description: "Failed to switch account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error toggling account type:", error);
            toast({
                title: "Error",
                description: "Error while switching account.",
                variant: "destructive",
            });
        }
    };

    if (!session) {
        return (
            <Card className="w-full max-w-md p-4 mx-auto mt-32 text-center mb-60">
                <CardHeader>
                    <CardTitle>Not Signed In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => signIn()}>Sign In</Button>
                </CardContent>
            </Card>
        );
    }

    const { user } = session;
    return (
        <Card className="w-full max-w-md p-4 mx-auto mt-10 mb-80">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{user.username}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                            Account Type:
                            <span className={`font-semibold ${accountType === "freelancer" ? "text-teal-600" : "text-blue-600"}`}>
                                {accountType}
                            </span>
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={toggleAccountType}
                    className="mt-4 mr-4 bg-teal-600 hover:bg-teal-700"
                >
                    Switch to {accountType === "client" ? "Freelancer" : "Client"}
                </Button>
                <Button variant="secondary" onClick={() => signOut()} className="mt-2">
                    Sign Out
                </Button>
            </CardContent>
        </Card>
    );
};

export default UserProfile;
