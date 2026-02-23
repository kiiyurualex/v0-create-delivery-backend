import { Shield, Clock, MapPin, Headphones } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Same-Day Delivery",
    description: "Get your packages delivered same-day within Nairobi or next-day across Kenya.",
  },
  {
    icon: MapPin,
    title: "All 47 Counties",
    description: "We deliver to every county in Kenya through our G4S logistics network.",
  },
  {
    icon: Shield,
    title: "G4S Secured",
    description: "All shipments are transported by G4S, ensuring world-class security and handling.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our Nairobi-based support team is available around the clock to assist you.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Antex Deliveries?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with a global network to ensure your packages reach their destination safely and on time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-purple" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
