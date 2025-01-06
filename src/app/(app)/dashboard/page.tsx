"use client"

import React, { useEffect, useState } from 'react'
import Client from "@/components/dashboard/client"
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import ViewProjects from '../projects/page';

function Page() {
    const title = "Recently Uploaded Projects"

    const [accountType, setAccountType] = useState(null)
    const { toast } = useToast()

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

    return (
        <div>
            {accountType === "client" ? (
                <Client />
            ) : (
                <ViewProjects title={title} primaryBtn />
            )}
        </div>
    )
}

export default Page