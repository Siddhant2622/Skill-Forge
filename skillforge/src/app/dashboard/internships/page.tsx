"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Banknote,
  Globe,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

// Mock Data representing aggregated internships
const MOCK_INTERNSHIPS = [
  {
    id: "1",
    title: "Software Engineering Intern",
    company: "Google",
    location: "Bangalore, Remote",
    stipend: "₹80,000 / month",
    type: "Summer Internship",
    platform: "LinkedIn",
    platformColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    matchScore: 92,
    postedAt: "2 hours ago",
    skills: ["React", "TypeScript", "Node.js"],
    link: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineering%20Intern"
  },
  {
    id: "2",
    title: "Frontend Developer Intern",
    company: "Razorpay",
    location: "Remote",
    stipend: "₹40,000 / month",
    type: "6 Months",
    platform: "Naukri",
    platformColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    matchScore: 88,
    postedAt: "5 hours ago",
    skills: ["React", "CSS", "Redux"],
    link: "https://www.naukri.com/frontend-developer-intern-jobs"
  },
  {
    id: "3",
    title: "Web Development Challenge",
    company: "Flipkart GRiD",
    location: "Online",
    stipend: "PPO + ₹50,000 Prize",
    type: "Hackathon/Intern",
    platform: "Unstop",
    platformColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    matchScore: 85,
    postedAt: "1 day ago",
    skills: ["MERN Stack", "System Design"],
    link: "https://unstop.com/hackathons"
  },
  {
    id: "4",
    title: "Freelance UI Developer",
    company: "Global Client (US)",
    location: "Remote",
    stipend: "$20 - $30 / hour",
    type: "Freelance",
    platform: "Fiverr",
    platformColor: "bg-green-500/10 text-green-600 border-green-500/20",
    matchScore: 75,
    postedAt: "3 days ago",
    skills: ["Figma", "React", "Tailwind"],
    link: "https://www.fiverr.com/search/gigs?query=ui%20developer"
  },
  {
    id: "5",
    title: "SDE Intern",
    company: "Amazon",
    location: "Hyderabad",
    stipend: "₹85,000 / month",
    type: "6 Months",
    platform: "LinkedIn",
    platformColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    matchScore: 65,
    postedAt: "1 hour ago",
    skills: ["Java", "AWS", "DSA"],
    link: "https://www.linkedin.com/jobs/search/?keywords=SDE%20Intern"
  },
  {
    id: "6",
    title: "React Native Intern",
    company: "Cred",
    location: "Bangalore",
    stipend: "₹50,000 / month",
    type: "3 Months",
    platform: "Wellfound",
    platformColor: "bg-red-500/10 text-red-600 border-red-500/20",
    matchScore: 82,
    postedAt: "2 days ago",
    skills: ["React Native", "JavaScript"],
    link: "https://wellfound.com/jobs"
  }
];

export default function InternshipFinderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("All");

  const platforms = ["All", "LinkedIn", "Naukri", "Unstop", "Fiverr", "Wellfound"];

  const filteredInternships = MOCK_INTERNSHIPS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = activePlatform === "All" || job.platform === activePlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Global Internship Finder</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">
          SkillForge aggregates top internship and freelance opportunities from LinkedIn, Naukri, Unstop, and Fiverr in real-time. 
          Opportunities are ranked based on your System Career Twin match score.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="glass p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by role, company, or skill..." 
            className="pl-10 bg-background/50 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          {platforms.map(p => (
            <Badge 
              key={p} 
              variant={activePlatform === p ? "default" : "outline"}
              className={`cursor-pointer shrink-0 transition-all ${activePlatform === p ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setActivePlatform(p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInternships.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col glass-card border border-border/60 hover:border-primary/30 transition-all hover:shadow-md group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.company}
                  </div>
                </div>
                <Badge variant="outline" className={`${job.platformColor} font-semibold shadow-sm`}>
                  {job.platform}
                </Badge>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Banknote className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-foreground/80">{job.stipend}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  {job.type}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {job.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-[10px] bg-secondary/50">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <svg className="w-10 h-10 -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-secondary" />
                      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" 
                        className={job.matchScore >= 80 ? "text-emerald-500" : job.matchScore >= 60 ? "text-amber-500" : "text-red-500"} 
                        strokeDasharray="100" 
                        strokeDashoffset={100 - job.matchScore} 
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold">{job.matchScore}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="block font-semibold text-foreground">Twin Match</span>
                    <span className="block text-muted-foreground text-[10px]">{job.postedAt}</span>
                  </div>
                </div>

                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Apply Now
                  </Button>
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredInternships.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
            <Search className="w-8 h-8 mb-3 opacity-50" />
            <p>No internships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
