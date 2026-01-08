import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavbar from "../components/Navbar";
import bg from "../assets/image.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
     

      {/* HERO SECTION */}
      <section
        className="pt-16 min-h-screen bg-cover bg-center flex items-center justify-center text-center px-6"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            AutoCare – Never Miss Your Vehicle Service
          </motion.h1>

          <p className="text-gray-700 mb-8">
            AutoCare simplifies vehicle maintenance by tracking service
            schedules, providing timely reminders, and helping your vehicle
            stay in top condition.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose AutoCare?
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "Timely Reminders",
              desc: "Never miss a vehicle service with smart reminders.",
            },
            {
              title: "Service History",
              desc: "Track all past services and maintenance records.",
            },
            {
              title: "Performance Insights",
              desc: "Understand mileage, costs, and vehicle health.",
            },
            {
              title: "Cost Management",
              desc: "Manage vehicle expenses efficiently.",
            },
            {
              title: "Enhanced Safety",
              desc: "Keep your vehicle road-ready at all times.",
            },
            {
              title: "Easy Service Booking",
              desc: "Find and book trusted service centers (coming soon).",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 bg-red-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Simplify Your Vehicle Care?
        </h2>
        <p className="mb-6">
          Join thousands of users who trust AutoCare.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold"
        >
          Get Started Now
        </button>
      </section>

      <Footer />
    </>
  );
}
