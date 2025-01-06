"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Home, Briefcase, User, MessageSquare as Chat, LogOut } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleMenuToggle = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const [accountType, setAccountType] = React.useState(null)
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

    React.useEffect(() => {
        fetchUserType();
    }, []);


    return (
        <NavigationMenu className="border-b-[1px] border-gray-100 py-4 shadow-sm">

            <div className="w-screen flex items-center justify-between px-6">
                {/* Left: Company Name */}
                <div className="text-teal-600  text-2xl font-semibold">
                    Mini-Lancing
                </div>

                {/* Right: Desktop Navigation Menu */}
                <NavigationMenuList className="hidden md:flex space-x-6">
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Dashboard
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        {accountType === "client" ? (
                            <Link href="/projects" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                                >
                                    <Briefcase className="mr-2 h-5 w-5" />
                                    Projects
                                </NavigationMenuLink>
                            </Link>
                        ) : (
                            <Link href="/bids" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                                >
                                    <Briefcase className="mr-2 h-5 w-5" />
                                    Bids
                                </NavigationMenuLink>
                            </Link>
                        )}


                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href={`/profile`} legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <User className="mr-2 h-5 w-5" />
                                Profile
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/chat" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <Chat className="mr-2 h-5 w-5" />
                                Chat
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            onClick={() => signOut()}
                            className={`cursor-pointer text-red-600 hover:text-red-500 hover:bg-red-50 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>

                {/* Mobile Hamburger Button */}
                <Button
                    variant="ghost"
                    className="block md:hidden"
                    onClick={handleMenuToggle}
                >
                    {/* Rotate the menu icon on click */}
                    <Menu
                        className={`h-6 w-6 text-gray-800 text-lg transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : "rotate-0"
                            }`}
                    />
                </Button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden fixed inset-x-0 top-20 z-50 bg-white shadow-lg transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    } duration-500 ease-in-out`}
            >
                <NavigationMenuList className="flex flex-col space-y-2 py-4 px-6">
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink
                                onClick={handleMenuClose}
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Dashboard
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/projects" legacyBehavior passHref>
                            <NavigationMenuLink
                                onClick={handleMenuClose}
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <Briefcase className="mr-2 h-5 w-5" />
                                Projects
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/u/profile" legacyBehavior passHref>
                            <NavigationMenuLink
                                onClick={handleMenuClose}
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <User className="mr-2 h-5 w-5" />
                                Profile
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/chat" legacyBehavior passHref>
                            <NavigationMenuLink
                                onClick={handleMenuClose}
                                className={`text-gray-800 text-lg hover:text-teal-800 flex items-center transition-colors ${navigationMenuTriggerStyle()}`}
                            >
                                <Chat className="mr-2 h-5 w-5" />
                                Chat
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    );
}
