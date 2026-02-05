'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface ShipmentData {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  sender_name: string;
  recipient_name: string;
  pickup_date: string;
  estimated_delivery_date: string;
  total_cost: number;
  payment_method: string;
  status: string;
  packaging_type: string;
  weight: number;
  weight_unit: string;
}

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackingNumber = searchParams.get('tracking');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingNumber) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber)
        .single();

      if (error || !data) {
        router.push('/');
        return;
      }

      setShipment(data as ShipmentData);
      setLoading(false);
    };

    fetchShipment();
  }, [trackingNumber, supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading receipt...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">Receipt not found</p>
              <Button onClick={() => router.push('/')} className="bg-purple hover:bg-purple-dark">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-teal animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold text-purple mb-2">Shipment Booked Successfully!</h1>
            <p className="text-gray-600">Thank you for using Antex Deliveries</p>
          </div>

          {/* Receipt Card */}
          <Card className="shadow-xl border-2 border-orange mb-6">
            <CardHeader className="bg-gradient-to-r from-purple to-purple-dark text-white">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Booking Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Tracking Number */}
              <div className="bg-gradient-to-r from-orange to-orange-light p-4 rounded-lg mb-6 text-white">
                <p className="text-xs sm:text-sm font-semibold mb-1">Tracking Number</p>
                <p className="text-lg sm:text-2xl font-bold font-mono break-all">{shipment.tracking_number}</p>
              </div>

              {/* Shipment Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Route */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Route
                  </p>
                  <p className="font-medium">{shipment.origin}</p>
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-orange rotate-90" />
                  </div>
                  <p className="font-medium">{shipment.destination}</p>
                </div>

                {/* Package Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-purple mb-1">Package Type</p>
                    <p className="text-gray-700">{shipment.packaging_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple mb-1">Weight</p>
                    <p className="text-gray-700">
                      {shipment.weight} {shipment.weight_unit}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold text-purple flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Pickup Date
                  </p>
                  <p className="text-gray-700">{formatDate(shipment.pickup_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Est. Delivery
                  </p>
                  <p className="text-gray-700">{formatDate(shipment.estimated_delivery_date)}</p>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Cost:</span>
                  <span className="font-semibold">${shipment.total_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-purple">
                  <span className="text-lg font-bold text-purple">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange">${shipment.total_cost.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple mb-1">Payment Method</p>
                <p className="text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange" />
                  {shipment.payment_method}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sender & Recipient Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Shipment Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-purple mb-2">Sender</p>
                <p className="text-gray-700">{shipment.sender_name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple mb-2">Recipient</p>
                <p className="text-gray-700">{shipment.recipient_name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="border-2 border-purple text-purple hover:bg-purple hover:text-white"
            >
              Print Receipt
            </Button>
            <Button
              onClick={() => router.push(`/track?tracking=${shipment.tracking_number}`)}
              className="bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple text-white"
            >
              Track Shipment
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-2 border-orange text-orange hover:bg-orange hover:text-white"
            >
              Back Home
            </Button>
          </div>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-teal-50 border border-teal rounded-lg">
            <p className="text-sm text-teal-900">
              📧 A confirmation email has been sent to your email address. You can track your shipment anytime using your tracking number.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
