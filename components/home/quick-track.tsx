"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

export function QuickTrack() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/track?tracking=${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Quick Track</h2>
          </div>
          
          <form onSubmit={handleTrack} className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter your tracking number (e.g., ANT-XXXXXX)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-teal hover:bg-teal-dark text-white px-8">
              <Search className="w-4 h-4 mr-2" />
              Track
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
