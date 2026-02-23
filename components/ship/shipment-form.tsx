"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Package, User, CalendarIcon, Info, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format, addDays } from "date-fns";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ShipmentData {
  origin_city: string;
  destination_city: string;
  packaging_type: string;
  package_count: number;
  package_weight: number;
  weight_unit: string;
  add_insurance: boolean;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  pickup_date: Date | null;
  estimated_delivery_date: Date | null;
  shipping_option: string;
}

const SHIPPING_OPTIONS = [
  { id: "g4s_express", name: "G4S Express", days: 1, basePrice: 800 },
  { id: "g4s_standard", name: "G4S Standard", days: 3, basePrice: 450 },
  { id: "g4s_economy", name: "G4S Economy", days: 5, basePrice: 250 },
];

export function ShipmentForm() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  
  const [formData, setFormData] = useState<ShipmentData>({
    origin_city: "",
    destination_city: "",
    packaging_type: "own",
    package_count: 1,
    package_weight: 0,
    weight_unit: "kg",
    add_insurance: false,
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    pickup_date: null,
    estimated_delivery_date: null,
    shipping_option: "",
  });

  const [costs, setCosts] = useState({
    shipping: 0,
    insurance: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        setFormData(prev => ({ ...prev, sender_email: user.email || "" }));
      }
    };
    getUser();
  }, [supabase.auth]);

  const calculateRates = () => {
    if (!formData.origin_city || !formData.destination_city || formData.package_weight <= 0 || !formData.shipping_option) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedOption = SHIPPING_OPTIONS.find(opt => opt.id === formData.shipping_option);
    if (!selectedOption) return;

    const weightInKg = formData.weight_unit === "lb" ? formData.package_weight * 0.453592 : formData.package_weight;
    const shippingCost = selectedOption.basePrice * weightInKg * formData.package_count;
    const insuranceCost = formData.add_insurance ? shippingCost * 0.05 : 0;
    const taxAmount = (shippingCost + insuranceCost) * 0.16;
    const totalCost = shippingCost + insuranceCost + taxAmount;

    setCosts({
      shipping: shippingCost,
      insurance: insuranceCost,
      tax: taxAmount,
      total: totalCost,
    });

    // Set estimated delivery date based on pickup date and shipping option
    if (formData.pickup_date) {
      const deliveryDate = addDays(formData.pickup_date, selectedOption.days);
      setFormData(prev => ({ ...prev, estimated_delivery_date: deliveryDate }));
    }

    setCalculated(true);
  };

  const handleBookShipment = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/ship");
      return;
    }

    if (!calculated) {
      alert("Please calculate rates first");
      return;
    }

    if (!formData.pickup_date) {
      alert("Please select a pickup date");
      return;
    }

    setLoading(true);

    try {
      const selectedOption = SHIPPING_OPTIONS.find(opt => opt.id === formData.shipping_option);

      const { data, error } = await supabase
        .from("shipments")
        .insert({
          user_id: user.id,
          origin: formData.origin_city,
          destination: formData.destination_city,
          packaging_type: formData.packaging_type,
          num_packages: formData.package_count,
          weight: formData.package_weight,
          weight_unit: formData.weight_unit,
          has_insurance: formData.add_insurance,
          sender_name: formData.sender_name,
          sender_email: formData.sender_email,
          sender_phone: formData.sender_phone,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          recipient_phone: formData.recipient_phone,
          pickup_date: formData.pickup_date?.toISOString(),
          estimated_delivery_date: formData.estimated_delivery_date?.toISOString(),
          shipping_cost: costs.shipping,
          insurance_cost: costs.insurance,
          tax_cost: costs.tax,
          total_cost: costs.total,
          payment_method: paymentMethod,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to book shipment: ${error.message}`);
        setLoading(false);
        return;
      }

      // Add initial tracking status
      const { error: trackingError } = await supabase.from("shipment_status_history").insert({
        shipment_id: data.id,
        status: "pending",
        location: formData.origin_city,
        notes: "Shipment booked, awaiting pickup",
      });

      router.push(`/receipt?tracking=${data.tracking_number}`);
    } catch {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Where are you shipping? */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple">
                <MapPin className="w-4 h-4 text-red-500" />
                Where are you shipping?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">From <span className="text-red-500">*</span></Label>
                  <Input
                    id="origin"
                    placeholder="e.g., Nairobi, Westlands"
                    value={formData.origin_city}
                    onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">To <span className="text-red-500">*</span></Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Mombasa, Nyali"
                    value={formData.destination_city}
                    onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple">
                <Package className="w-4 h-4" />
                Package Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Packaging Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.packaging_type}
                    onValueChange={(value) => setFormData({ ...formData, packaging_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select packaging type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">Your Own Packaging</SelectItem>
                      <SelectItem value="box_small">Small Box (30x20x15 cm)</SelectItem>
                      <SelectItem value="box_medium">Medium Box (45x35x25 cm)</SelectItem>
                      <SelectItem value="box_large">Large Box (60x45x35 cm)</SelectItem>
                      <SelectItem value="envelope">Envelope</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageCount">Number of Packages <span className="text-red-500">*</span></Label>
                    <Input
                      id="packageCount"
                      type="number"
                      min="1"
                      value={formData.package_count}
                      onChange={(e) => setFormData({ ...formData, package_count: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Package Weight <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        value={formData.package_weight || ""}
                        onChange={(e) => setFormData({ ...formData, package_weight: parseFloat(e.target.value) || 0 })}
                        className="flex-1"
                      />
                      <Select
                        value={formData.weight_unit}
                        onValueChange={(value) => setFormData({ ...formData, weight_unit: value })}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Shipping Option */}
                <div className="space-y-2">
                  <Label>Shipping Option <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.shipping_option}
                    onValueChange={(value) => setFormData({ ...formData, shipping_option: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping option" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIPPING_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name} ({option.days} {option.days === 1 ? "day" : "days"}) - KES {option.basePrice}/kg
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pickup Date */}
                <div className="space-y-2">
                  <Label>Pickup Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.pickup_date ? (
                          format(formData.pickup_date, "PPP")
                        ) : (
                          <span className="text-muted-foreground">Select pickup date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.pickup_date || undefined}
                        onSelect={(date) => setFormData({ ...formData, pickup_date: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Estimated Delivery */}
                {formData.estimated_delivery_date && (
                  <div className="bg-teal/10 border border-teal/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-teal-dark">
                      <CalendarIcon className="w-5 h-5" />
                      <span className="font-medium">Estimated Delivery: {format(formData.estimated_delivery_date, "PPP")}</span>
                    </div>
                  </div>
                )}

                {/* Insurance */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <Checkbox
                    id="insurance"
                    checked={formData.add_insurance}
                    onCheckedChange={(checked) => setFormData({ ...formData, add_insurance: checked === true })}
                  />
                  <Label htmlFor="insurance" className="flex items-center gap-2 cursor-pointer">
                    Add shipping insurance (+5% of shipping cost)
                    <Info className="w-4 h-4 text-blue-500" />
                  </Label>
                </div>
              </div>
            </div>

            {/* Sender & Recipient */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-purple">
                <User className="w-4 h-4" />
                Sender & Recipient
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="senderName"
                      placeholder="Your full name"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.sender_email}
                      onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderPhone">Sender Phone</Label>
                    <Input
                      id="senderPhone"
                      placeholder="+254 700 000 000"
                      value={formData.sender_phone}
                      onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="recipientName"
                      placeholder="Recipient's full name"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="recipient@email.com"
                      value={formData.recipient_email}
                      onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientPhone">Recipient Phone</Label>
                    <Input
                      id="recipientPhone"
                      placeholder="+254 700 000 000"
                      value={formData.recipient_phone}
                      onChange={(e) => setFormData({ ...formData, recipient_phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              type="button"
              onClick={calculateRates}
              className="w-full bg-purple hover:bg-purple-dark text-white"
            >
              Calculate Rates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Shipping Options & Payment */}
      <div className="lg:col-span-1 space-y-6">
        {/* Available Shipping Options */}
        <Card className="shadow-lg">
          <CardHeader className="bg-teal text-white rounded-t-lg">
            <CardTitle className="text-lg">Available Shipping Options</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!calculated ? (
              <p className="text-gray-500 text-center py-4">
                Fill in shipment details and click &quot;Calculate Rates&quot;
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">KES {costs.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium">KES {costs.insurance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (16%)</span>
                  <span className="font-medium">KES {costs.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-teal">KES {costs.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="w-4 h-4 text-teal"
              />
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">PayPal</div>
                <span>Pay with PayPal</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="w-4 h-4 text-teal"
              />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded">VISA</div>
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">MC</div>
                </div>
                <span>Credit/Debit Card</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="mpesa"
                checked={paymentMethod === "mpesa"}
                onChange={() => setPaymentMethod("mpesa")}
                className="w-4 h-4 text-teal"
              />
              <div className="flex items-center gap-2">
                <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">M-PESA</div>
                <span>Pay with M-Pesa</span>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button
          onClick={handleBookShipment}
          disabled={loading || !calculated}
          className="w-full bg-teal hover:bg-teal-dark text-white py-6 text-lg font-semibold"
        >
          {loading ? "Processing..." : "Book Shipment"}
        </Button>
      </div>
    </div>
  );
}
