"use client";

import React, { useEffect, useState } from "react";
import Client from "@/components/dashboard/client";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ViewProjects from "@/components/project/ViewProject"; // Corrected path

function Page() {
    const [accountType, setAccountType] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchUserType() {
            try {
                const response = await axios.get("/api/profile");
                if (response.status === 200) {
                    setAccountType(response.data.userType);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error fetching user type.",
                    variant: "destructive",
                });
            }
        }

        fetchUserType();
    }, [toast]);

    return (
        <div>
            {accountType === "client" ? (
                <Client />
            ) : (
                <ViewProjects title="Recently Uploaded Projects" primaryBtn={true} />
            )}
        </div>
    );
}

export default Page;
