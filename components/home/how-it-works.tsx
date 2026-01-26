import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Enter Shipment Details",
    description: "Fill in the sender and recipient information along with package details.",
  },
  {
    icon: CreditCard,
    title: "Choose & Pay",
    description: "Select your preferred shipping option and complete the payment securely.",
  },
  {
    icon: Truck,
    title: "We Ship",
    description: "Your package is picked up and shipped to the destination.",
  },
  {
    icon: CheckCircle,
    title: "Delivery",
    description: "Package delivered safely to the recipient with tracking updates.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600">Simple steps to ship your packages worldwide</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-teal" />
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
