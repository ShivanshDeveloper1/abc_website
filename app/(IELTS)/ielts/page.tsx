"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Headphones, PenTool, Mic, ArrowRight, Clock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import ContactComing from "@/components/(Homepage)/ContactComing";

export default function IeltsLandingPage() {
  const courses = [
    {
      title: "Speaking Mastery",
      description:
        "Overcome hesitation, build fluency, and ace the 1-on-1 interview with mock sessions.",
      icon: <Mic className="w-8 h-8 text-red-600" />,
    },
    {
      title: "Listening Pro",
      description:
        "Sharpen your focus and understand various accents with our intensive audio drills.",
      icon: <Headphones className="w-8 h-8 text-red-600" />,
    },
    {
      title: "Reading Strategies",
      description:
        "Learn skimming and scanning techniques to find answers quickly and accurately.",
      icon: <BookOpen className="w-8 h-8 text-red-600" />,
    },
    {
      title: "Writing Excellence",
      description:
        "Structure your essays perfectly for Task 1 and Task 2 to maximize your band score.",
      icon: <PenTool className="w-8 h-8 text-red-600" />,
    },
  ];

  const timings = [
    { course: "Spoken English", time: "12:30 PM - 1:30 PM" },
    { course: "IELTS Preparation", time: "12:00 PM - 3:00 PM" },
    { course: "PTE Academic", time: "12:00 PM - 3:00 PM" },
  ];

  // Array of 5 placeholders for your images
  const resultImages = [
    "/result/Iilets/results.jpg", // url 1
    "/result/Iilets/results1.jpg", // url 2
    "/result/Iilets/results2.jpeg", // url 3
    "/result/Iilets/results3.jpeg", // url 4
    "/result/Iilets/results4.jpeg", // url 5
  ];

  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 ">
          {/* Background Blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <ContactComing close={() => setOpen(false)} />
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-extrabold text-red-600 tracking-tight">
                ABC Institute
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#courses"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Courses
              </a>
              <a
                href="/about-us"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                About Us
              </a>
              <button
                onClick={() => router.push("/contact")}
                className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                Book Free Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-red-50 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6"
          >
            Achieve Your Dream <span className="text-red-600">IELTS Band</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Expert guidance, proven strategies, and comprehensive study
            materials to help you score 8+ on your first attempt.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => router.push("/contact")}
              className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30 flex items-center mx-auto group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100 opacity-50 blur-3xl"></div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Specialized IELTS Courses
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:border-red-100 group relative overflow-hidden"
              >
                {/* Top border hover effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

                <div className="bg-red-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {course.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {course.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-red-600 font-semibold hover:text-red-700"
                >
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Timings Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Batch Timings
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {timings.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-red-50 p-4 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.course}
                </h3>
                <div className="mt-2 bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow-sm">
                  {item.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results / Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Success Stories
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              Join the hundreds of students who have successfully achieved their target scores and are now studying or working abroad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {resultImages.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden relative shadow-sm border border-gray-200 group flex flex-col items-center justify-center text-gray-400 hover:border-red-200 transition-colors"
              >
                {url ? (
                  /* Once you have URLs, this image will display */
                  <img
                    src={url}
                    alt={`Student Result ${index + 1}`}
                    className="w-full h-full"
                  />
                ) : (
                  /* Placeholder UI */
                  <>
                    <Award className="w-10 h-10 mb-2 opacity-50 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-medium group-hover:text-red-500 transition-colors">
                      Result {index + 1}
                    </span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to study or work abroad?
          </h2>
          <p className="text-red-100 mb-8 text-lg">
            Join ABC Institute today and get personalized feedback from
            certified IELTS trainers.
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Contact Us Now
          </button>
        </div>
      </section>
    </div>
  );
}