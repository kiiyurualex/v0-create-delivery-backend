import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Clock, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-purple to-purple-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="text-orange">★</span>
              <span>Trusted by 50,000+ Customers Worldwide</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Fast & Reliable{" "}
              <span className="text-teal">Delivery Services</span>
            </h1>
            
            <p className="text-purple-100 text-lg max-w-md">
              Experience lightning-fast delivery with real-time tracking. Your packages, delivered safely and on time, every time.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/ship">
                <Button size="lg" className="bg-orange hover:bg-orange-light text-white font-semibold px-8">
                  Ship Now
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 bg-transparent">
                  Track Package
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-teal">10M+</div>
                <div className="text-purple-200 text-sm">Deliveries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal">99.9%</div>
                <div className="text-purple-200 text-sm">On-Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal">150+</div>
                <div className="text-purple-200 text-sm">Countries</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-96">
              {/* Purple circle background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-purple-light/30"></div>
              </div>
              
              {/* Delivery Truck */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <Truck className="w-40 h-40 text-orange" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Status Cards */}
              <div className="absolute top-10 right-10 bg-white text-gray-800 rounded-lg shadow-lg px-4 py-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">Package Delivered</span>
              </div>
              
              <div className="absolute bottom-10 left-10 bg-white text-gray-800 rounded-lg shadow-lg px-4 py-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal" />
                <span className="font-medium">Arriving in 15 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
