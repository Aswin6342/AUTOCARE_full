import { motion } from "framer-motion";
import Footer from "../components/Footer";

const features = [
  {
    title: "Timely Reminders",
    description:
      "Never miss a service appointment with smart and timely notifications for your vehicle.",
    icon: "⏰",
  },
  {
    title: "Comprehensive History",
    description:
      "Maintain a complete record of all past services, repairs, and maintenance details.",
    icon: "📄",
  },
  {
    title: "Performance Insights",
    description:
      "Track mileage, fuel efficiency, and overall vehicle health with ease.",
    icon: "📊",
  },
  {
    title: "Cost Management",
    description:
      "Monitor service costs and manage your vehicle expenses efficiently.",
    icon: "💰",
  },
  {
    title: "Enhanced Safety",
    description:
      "Ensure your vehicle is always road-ready through proactive service tracking.",
    icon: "🛡️",
  },
  {
    title: "Easy Service Booking",
    description:
      "Find and book trusted service centers directly through the app (coming soon).",
    icon: "🔧",
  },
];

export default function Features() {
  return (
    <>
      {/* Navbar */}

      {/* Page Content */}
      <section className="pt-24 pb-20 bg-gray-50">
        {/* Heading */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl font-bold mb-3">
            Why Choose AutoCare?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AutoCare provides everything you need to manage your vehicle
            maintenance efficiently, safely, and stress-free.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="
                bg-white rounded-xl shadow
                p-6 text-center
                hover:shadow-lg transition
              "
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
