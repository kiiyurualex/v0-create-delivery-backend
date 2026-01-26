import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check, Globe, Users, Award, TrendingUp } from "lucide-react";

const features = [
  "Real-time tracking on all shipments",
  "Secure handling and insurance options",
  "24/7 customer support",
  "Competitive pricing with no hidden fees",
];

const stats = [
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: Globe, value: "150+", label: "Countries Served" },
  { icon: Award, value: "10M+", label: "Packages Delivered" },
  { icon: TrendingUp, value: "99.9%", label: "On-Time Delivery" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple to-purple-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">About Antex Deliveries</h1>
            <p className="text-purple-100 text-lg">Your trusted partner in global logistics since 2010</p>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image/Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-orange to-orange-light rounded-2xl p-12 flex items-center justify-center">
                  <Globe className="w-48 h-48 text-teal" strokeWidth={1} />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Delivering Excellence Worldwide
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Antex Deliveries has been at the forefront of logistics innovation for over a decade. 
                  We combine cutting-edge technology with a global network to ensure your packages reach 
                  their destination safely and on time.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our commitment to customer satisfaction, reliability, and transparency has made us 
                  the preferred choice for individuals and businesses across 150+ countries.
                </p>

                {/* Feature List */}
                <div className="space-y-3 pt-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-teal" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
              <p className="text-gray-600">Trusted by thousands of customers worldwide</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-purple" />
                  </div>
                  <div className="text-3xl font-bold text-teal mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To provide fast, reliable, and affordable delivery services that connect people and 
              businesses across the globe. We strive to exceed expectations with every package we handle, 
              making shipping simple and stress-free for everyone.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gradient-to-r from-purple to-purple-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-purple-100">
                  We strive for excellence in every delivery, ensuring your packages arrive safely and on time.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-purple-100">
                  Our customers are at the heart of everything we do. Your satisfaction is our priority.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-purple-100">
                  With operations in 150+ countries, we bring the world closer together, one package at a time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
