"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";

// Define a type for project
interface Project {
  _id: string;
  title: string;
  details: string;
  amount: string;
  updatedAt: string;
  bids: {
    bid: string;
    userId: string;
    username: string;
    createdAt: string;
  }[];
}

export default function UserBiddedProjects({ title }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Function to fetch projects with enhanced error handling
  const fetchUserBiddedProjects = async (retry = false) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get("/api/bids");
      const sortedProjects = response.data.projects.sort(
        (a: Project, b: Project) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setProjects(sortedProjects);
      setFilteredProjects(sortedProjects);
      toast({
        title: "Success",
        description: "Projects fetched successfully",
        variant: "default",
      });
    } catch (error: any) {
      setIsError(true);
      const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });

      // Retry option for network errors
      if (!retry && error.message === "Network Error") {
        setTimeout(() => fetchUserBiddedProjects(true), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch with error handling
  useEffect(() => {
    fetchUserBiddedProjects();
  }, []);

  // Filter projects based on search term and date range
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

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{title ? title : "Your Bidded Projects"}</h2>

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
        ) : isError ? (
          <div className="text-center text-red-600 mt-4">
            <p>{errorMessage}</p>
            <button
              onClick={() => fetchUserBiddedProjects()}
              className="text-teal-600 underline mt-2"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
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
                  {/* User's bid display */}
                  {project.bids.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-gray-700 font-semibold mb-2">Your Bid</h3>
                      <div className="text-gray-700 bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">{project.bids[0].username}</p>
                        <p className="text-gray-600 italic">"{project.bids[0].bid}"</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Bid submitted on: {new Date(project.bids[0].createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
