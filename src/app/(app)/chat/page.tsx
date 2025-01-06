"use client"

import { useState, useEffect } from "react";

export default function ComingSoon() {
    // Countdown Timer Logic
    const calculateTimeLeft = () => {
        const launchDate = new Date("2024-12-31"); // Set your launch date
        const now = new Date();
        const difference = launchDate - now;

        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Convert timeLeft object to displayable format
    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval]) {
            return null;
        }
        return (
            <span key={interval} className="mx-2">
                <span className="text-3xl font-bold">{timeLeft[interval]}</span>{" "}
                <span className="text-sm capitalize">{interval}</span>
            </span>
        );
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-white text-gray-800">
            {/* Hero Section */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-teal-700 mb-4">
                    Something Amazing is Coming Soon! 🚀
                </h1>
                <p className="text-lg text-gray-600">
                    We're putting the final touches on our awesome platform. Stay tuned!
                </p>
            </header>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center text-center mb-10 text-gray-800 bg-white shadow-md rounded-lg p-4">
                {timerComponents.length ? (
                    timerComponents
                ) : (
                    <span className="text-2xl font-bold">It's time! 🎉</span>
                )}
            </div>

            {/* Notify Me Section */}
            <form
                className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md"
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thanks for subscribing!");
                }}
            >
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full flex-1 p-3 rounded-lg border border-teal-300 focus:ring focus:ring-teal-200"
                />
                <button
                    type="submit"
                    className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-all"
                >
                    Notify Me
                </button>
            </form>
        </div>
    );
}
