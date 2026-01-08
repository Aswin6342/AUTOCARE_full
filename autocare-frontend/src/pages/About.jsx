import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div>
              <Navbar />

    <div className="min-h-screen bg-black text-white pt-28 px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-black/70 border border-red-600/40
                   rounded-2xl shadow-2xl p-10"
      >
        {/* Title */}
        <h1 className="text-4xl font-bold text-red-500 mb-8 text-center">
          About AutoCare
        </h1>

        {/* Purpose */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            Our Purpose
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            AutoCare is designed to help vehicle owners stay on top of their
            vehicle maintenance without stress or confusion.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Many people forget service dates for their vehicles, which can lead
            to unexpected problems, reduced performance, and higher repair
            costs. AutoCare exists to make vehicle service tracking simple,
            organized, and reliable.
          </p>
        </section>

        {/* What AutoCare Does */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            What AutoCare Does
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            AutoCare provides a single platform where users can manage all their
            vehicle service information in one place.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Whether you own a car, bike, or scooter, AutoCare helps you track
            service schedules and prepares you to receive timely reminders so
            your vehicle stays in the best condition.
          </p>
        </section>

        {/* Features */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-red-400 mb-6">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Simple user registration and login",
              "Add and manage multiple vehicles",
              "Support for cars, bikes, and scooters",
              "Track last and upcoming service dates",
              "Automatic service date calculation",
              "Clean and easy-to-use dashboard",
              "Modern red and black themed interface",
              "Future-ready for reminder notifications",
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className="bg-black/80 border border-red-600/40
                           rounded-xl p-4 shadow-md"
              >
                <p className="text-gray-200 font-medium">
                  {feature}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
    </div>
  );
}
