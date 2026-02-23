import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShipmentForm } from "@/components/ship/shipment-form";

export default function ShipPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple to-purple-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Ship Across Kenya</h1>
            <p className="text-purple-100">Get instant KES quotes and book your G4S-secured shipment in minutes</p>
          </div>
        </div>
        
        {/* Shipment Form */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ShipmentForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
