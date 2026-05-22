"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import ContactComing from "./ContactComing";
import { useRouter } from "next/navigation";

const slides = [
 {
  id: 1,
  title: "JEE / NEET Dummy Batch Started",
  highlight: "Complete Exam Preparation",
  subtitle: "Join Saharanpur’s most result-oriented JEE / NEET Dummy Batch for focused preparation.",
  description: "Learn with experienced educators, structured study plans, regular tests, and complete guidance to achieve top ranks.",
  cta: "Join Now",
  src: "/courosol/DummyBatch.jpeg",
  bgColor: "bg-gradient-to-r from-red-600 to-red-800",
  accentColor: "text-white",
},
  {
    id: 2,
    title: "Test Series Launching",
    highlight: "NEET BATCHES",
    subtitle:
      "Smart practice designed to maximize your NEET and JEE performance.",
    description: "Unlock your potential with affordable learning solutions.",
    cta: "Explore Batches",
    src: "/courosol/test.jpeg",
    bgColor: "bg-red-600",
    accentColor: "text-red-100",
    price: "3000",
  },
  {
    id: 3,
    title: "New Batches Starting",
    highlight: "Class 6 to class12",
    subtitle: "Strong foundation for Classes 6–12 with expert guidance.",
    description: "Get up to 90% scholarship on our classroom courses.",
    cta: "Apply Now",
    src: "/course/sixtoeight.jpeg",
    bgColor: "bg-red-600",
    accentColor: "text-red-200",
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Locked outer background to white for both modes
    <div className="relative w-full bg-white dark:bg-white mt-[84px] px-4 md:px-8 py-6 flex justify-center">
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

      <div className="relative w-full max-w-7xl h-[650px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Slider Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full h-full flex flex-col md:flex-row items-center px-6 pt-12 md:pt-0 md:px-16 ${slide.bgColor} relative`}
            >
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              {/* LEFT SIDE: TEXT CONTENT */}
              <div className="w-full md:w-[40%] z-10 flex flex-col items-center text-center md:items-start md:text-left space-y-4">
                <span
                  className={`font-bold tracking-wider uppercase text-xs md:text-sm ${slide.accentColor} dark:${slide.accentColor} bg-white/20 dark:bg-white/20 px-4 py-1.5 rounded-full`}
                >
                  {slide.highlight}
                </span>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white dark:text-white leading-tight">
                  {slide.title}
                </h2>

                <p className="text-base md:text-xl text-red-50 dark:text-red-50 font-medium">
                  {slide.subtitle}
                </p>

                <button
                  className="mt-4 bg-white dark:bg-white text-red-700 dark:text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-100 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                  onClick={() => router.push('/contact')}
                >
                  {slide.cta}
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* PRICE RELATIVE */}
              {slide.price && (
                <div className="absolute z-20 top-2 right-6 md:top-10 md:right-10 rotate-[-4deg]">
                  <div className="px-6 py-3 rounded-2xl bg-white/20 dark:bg-white/20 backdrop-blur-md border border-white/30 dark:border-white/30 shadow-xl">
                    <p className="text-white dark:text-white text-xs font-semibold uppercase tracking-wide opacity-80">
                      Special Price
                    </p>

                    <div className="flex items-end gap-2">
                      <p className="text-white dark:text-white font-extrabold text-xl md:text-2xl leading-none">
                        ₹{slide.price}
                      </p>

                      <span className="text-white/60 dark:text-white/60 text-sm font-semibold line-through">
                        ₹{parseInt(slide.price) + 5000}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT SIDE: IMAGE CONTAINER */}
              <div className="w-full md:w-[60%] h-[300px] md:h-full relative flex items-end md:items-center justify-center z-10 p-4 pb-12 md:pb-0">
                <div
                  className="
                    relative 
                    w-full 
                    md:w-[95%] 
                    aspect-[16/9] md:aspect-auto 
                    md:h-[85%] 
                    rounded-2xl 
                    border-2 border-white dark:border-white
                    shadow-2xl 
                    overflow-hidden 
                    bg-black/10 dark:bg-black/10
                    translate-y-2 md:translate-y-0 
                  "
                >
                  {/* Background Fill Layer */}
                  <div className="absolute inset-0">
                    <Image
                      src={slide.src}
                      alt="blur-bg"
                      fill
                      className="object-cover scale-110 blur-sm opacity-40 dark:opacity-40"
                    />
                  </div>

                  {/* Main Image */}
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    className="object-contain z-10"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION DOTS */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-white dark:bg-white"
                  : "w-2 bg-white/40 dark:bg-white/40 hover:bg-white/60 dark:hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;