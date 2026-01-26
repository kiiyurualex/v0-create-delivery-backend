"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Package, Truck, Clock, CheckCircle, Plus, MapPin, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { User } from "@supabase/supabase-js";

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  recipient_name: string;
  pickup_date: string;
  estimated_delivery_date: string;
  total_cost: number;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  picked_up: { icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" },
  in_transit: { icon: Truck, color: "text-purple", bgColor: "bg-purple/10" },
  out_for_delivery: { icon: Truck, color: "text-teal", bgColor: "bg-teal/10" },
  delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  cancelled: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // Fetch user's shipments
      const { data: shipmentsData } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (shipmentsData) {
        setShipments(shipmentsData);
        
        // Calculate stats
        const pending = shipmentsData.filter(s => s.status === "pending").length;
        const inTransit = shipmentsData.filter(s => ["picked_up", "in_transit", "out_for_delivery"].includes(s.status)).length;
        const delivered = shipmentsData.filter(s => s.status === "delivered").length;
        
        setStats({
          total: shipmentsData.length,
          pending,
          inTransit,
          delivered,
        });
      }

      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
              </h1>
              <p className="text-gray-600">Manage and track all your shipments</p>
            </div>
            <Link href="/ship" className="mt-4 md:mt-0">
              <Button className="bg-purple hover:bg-purple-dark text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Shipment
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-gray-500">Total Shipments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.inTransit}</p>
                    <p className="text-sm text-gray-500">In Transit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.delivered}</p>
                    <p className="text-sm text-gray-500">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipments List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {shipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments yet</h3>
                  <p className="text-gray-500 mb-4">Start shipping with Antex Deliveries today!</p>
                  <Link href="/ship">
                    <Button className="bg-teal hover:bg-teal-dark text-white">
                      Create Your First Shipment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {shipments.map((shipment) => {
                    const statusConfig = STATUS_CONFIG[shipment.status] || STATUS_CONFIG.pending;
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <Link 
                        key={shipment.id} 
                        href={`/track?tracking=${shipment.tracking_number}`}
                        className="block"
                      >
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}>
                                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{shipment.tracking_number}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>{shipment.origin} → {shipment.destination}</span>
                                </div>
                                <p className="text-sm text-gray-500">To: {shipment.recipient_name}</p>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                                {STATUS_LABELS[shipment.status]}
                              </span>
                              {shipment.estimated_delivery_date && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Est. {format(new Date(shipment.estimated_delivery_date), "MMM d, yyyy")}</span>
                                </div>
                              )}
                              <p className="text-sm font-medium text-teal">${shipment.total_cost.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
