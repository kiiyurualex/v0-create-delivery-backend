import { Shield, Clock, Globe, Headphones } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Express Delivery",
    description: "Get your packages delivered within 24-48 hours with our express shipping option.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Ship to over 150+ countries worldwide with reliable international delivery.",
  },
  {
    icon: Shield,
    title: "Secure Handling",
    description: "Your packages are handled with care and covered by our comprehensive insurance.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you.",
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
