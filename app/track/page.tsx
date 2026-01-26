"use client";

import React from "react"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Search, Package, MapPin, Calendar, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  sender_name: string;
  recipient_name: string;
  pickup_date: string;
  estimated_delivery_date: string;
  total_cost: number;
  created_at: string;
}

interface StatusHistory {
  id: string;
  status: string;
  location: string;
  notes: string;
  created_at: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  picked_up: <Package className="w-5 h-5 text-blue-500" />,
  in_transit: <Truck className="w-5 h-5 text-purple" />,
  out_for_delivery: <Truck className="w-5 h-5 text-teal" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <AlertCircle className="w-5 h-5 text-red-500" />,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Pickup",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function TrackContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") || "";
  
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (initialTracking) {
      handleTrack();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", trackingNumber.trim().toUpperCase())
      .single();

    if (shipmentError || !shipmentData) {
      setError("Shipment not found. Please check the tracking number and try again.");
      setShipment(null);
      setStatusHistory([]);
      setLoading(false);
      return;
    }

    setShipment(shipmentData);

    const { data: historyData } = await supabase
      .from("shipment_status_history")
      .select("*")
      .eq("shipment_id", shipmentData.id)
      .order("created_at", { ascending: false });

    setStatusHistory(historyData || []);
    setLoading(false);
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"];
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / statusOrder.length) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple to-purple-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Track Your Shipment</h1>
            <p className="text-purple-100">Enter your tracking number to see real-time updates</p>
          </div>
        </div>

        <div className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Form */}
            <Card className="shadow-lg mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleTrack} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter tracking number (e.g., ANT-XXXXXX)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="bg-teal hover:bg-teal-dark text-white px-8">
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Tracking..." : "Track"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="shadow-lg mb-8 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipment Details */}
            {shipment && (
              <>
                {/* Status Overview */}
                <Card className="shadow-lg mb-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange" />
                        Shipment Status
                      </CardTitle>
                      <span className="text-sm text-gray-500">Tracking #: {shipment.tracking_number}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="flex items-center gap-1">
                          {STATUS_ICONS[shipment.status]}
                          <span className="font-medium">{STATUS_LABELS[shipment.status]}</span>
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple to-teal rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(shipment.status)}%` }}
                        />
                      </div>
                    </div>

                    {/* Shipment Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">From</p>
                            <p className="font-medium">{shipment.origin}</p>
                            <p className="text-sm text-gray-600">{shipment.sender_name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">To</p>
                            <p className="font-medium">{shipment.destination}</p>
                            <p className="text-sm text-gray-600">{shipment.recipient_name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-purple mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Pickup Date</p>
                            <p className="font-medium">
                              {shipment.pickup_date ? format(new Date(shipment.pickup_date), "PPP") : "Pending"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-teal mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Estimated Delivery</p>
                            <p className="font-medium">
                              {shipment.estimated_delivery_date ? format(new Date(shipment.estimated_delivery_date), "PPP") : "TBD"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status History */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple" />
                      Tracking History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statusHistory.length > 0 ? (
                      <div className="space-y-4">
                        {statusHistory.map((history, index) => (
                          <div key={history.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                                {STATUS_ICONS[history.status] || <Package className="w-5 h-5 text-gray-400" />}
                              </div>
                              {index < statusHistory.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 my-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-medium">{STATUS_LABELS[history.status] || history.status}</p>
                              <p className="text-sm text-gray-600">{history.location}</p>
                              {history.notes && (
                                <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {format(new Date(history.created_at), "PPP p")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No tracking history available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* No results message */}
            {searched && !shipment && !error && !loading && (
              <Card className="shadow-lg">
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shipment found</h3>
                  <p className="text-gray-500">Please check your tracking number and try again.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
