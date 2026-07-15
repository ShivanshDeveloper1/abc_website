"use client"; // Required for Framer Motion animations
import React, { useState } from "react";
import results from "@/data/toppers.json";
import Image from "next/image";
import { motion } from "framer-motion"; // Lightweight animation library
import ContactComing from "@/components/(Homepage)/ContactComing";

const Page = () => {

    const [open, setOpen] = useState(false);
  
  const NeetResults = results.filter((res) => res.course === "NEET");

  const banners = [
    { src: "/result/Neet/neet.jpeg", alt: "NEET Results" },
    { src: "/result/Neet/neetResult.jpeg", alt: "Combined Results" },
    { src: "/result/Neet/neetRanker.jpeg", alt: "NEET Rankers" },
    { src: "/result/JEE/Jee.jpeg", alt: "Result Both 3" },
    { src: "/result/Neet/neet1234.jpeg", alt: "Result Both 3" }, 
    { src: "/result/Neet/neet_0123.jpeg", alt: "Result Both 3" },
    { src: "/result/Neet/Biology_1234.jpeg", alt: "Result Both 3" },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each image animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };


  return (
    <main className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-200">
      {/* 1. HERO SECTION - UNTOUCHED AS REQUESTED */}
      {
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-3">

            {/* Background Blur */}
            <div className="absolute inset-0 bg-black/40  backdrop-blur-sm" onClick={()=> setOpen(false)} />


            {/* Modal */}


               <ContactComing close={() => setOpen(false)} />


            


          </div>
        )
      }
      <section className="w-full flex justify-center px-4 pt-16 md:pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row max-w-6xl w-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 z-10">
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 md:w-32 flex items-center justify-center py-6 md:py-12 px-4 shadow-inner">
            <p className="font-black text-white/90 uppercase tracking-[0.2em] md:-rotate-90 whitespace-nowrap text-2xl drop-shadow-md">
              NEET Results
            </p>
          </div>

          <div className="flex-1 py-10 px-8 md:py-16 md:px-14 flex flex-col justify-center">
            <span className="text-red-600 font-bold tracking-wider text-sm uppercase mb-3">
              🔥 Batch Starting Soon
            </span>

            <h1 className="text-3xl md:text-5xl text-slate-900 font-extrabold leading-[1.2] mb-6">
              600+ hours of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-cyan-700">
                Classroom Learning
              </span>
              ,
              <br className="hidden md:block" /> specially designed for serious
              NEET aspirants.
            </h1>

            <p className="text-slate-500 text-lg mb-10 max-w-2xl leading-relaxed">
              Study in a focused classroom environment with direct guidance from
              expert faculty. Get daily doubt solving, structured study
              material, and regular test series designed to build strong
              concepts and exam confidence — just like the top rankers.
            </p>

            <div className="flex flex-col xl:flex-row gap-10 xl:items-center justify-between">
              <div className="flex gap-4 md:gap-6 flex-wrap items-center">
                {NeetResults.slice(0, 5).map((res, index) => (
                  <div
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                    key={index}
                  >
                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-400/50">
                      <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white bg-white">
                        <Image
                          src={res.img}
                          alt={res.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <p className="font-semibold text-slate-700 text-xs md:text-sm group-hover:text-blue-600 transition-colors">
                      {res.name}
                    </p>
                  </div>
                ))}

                <div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 border-white transform transition-transform hover:scale-105 cursor-pointer hover:shadow-orange-400/40">
                  <p className="text-xl md:text-2xl font-black text-white leading-none drop-shadow-sm">
                    +7
                  </p>
                  <p className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider mt-1 opacity-90">
                    Top 10k
                  </p>
                </div>
              </div>

              <button onClick={()=> setOpen(!open)} className="cursor-pointer bg-slate-900 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-blue-600/30 whitespace-nowrap w-full md:w-auto text-center">
                Enroll Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ANIMATED HALL OF FAME SECTION */}
      <section className="w-full bg-[#9b1c1c] py-20 px-4 sm:px-6 lg:px-8 border-t-8 border-blue-600 flex flex-col items-center">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              OUR LEGACY OF <span className="text-amber-400">EXCELLENCE</span>
            </h2>
            <div className="h-1.5 w-32 bg-amber-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
              Real results from real classrooms. Our students consistently
              secure top ranks across India.
            </p>
          </div>

          {/* Animated Staggered Grid */}
          {/* Animated Uniform Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            // 1. CHANGED: Switched from 'columns' to 'grid' for perfectly even rows and columns
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {banners.map((banner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                // 2. CHANGED: Added 'aspect-[4/5]' to force every card into the exact same tall rectangle shape.
                // Removed 'break-inside-avoid' (only used for columns, not grid).
                className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hover:border-amber-400/50 transition-all duration-500 "
              >
                {/* 3. CHANGED: Replaced hardcoded width/height with 'fill'. This tells Next.js to perfectly fill the aspect-[4/5] parent container. */}
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-co object-top transition-transform duration-700 group-hover:scale-[1.05]"
                />

                {/* Gradient Overlay for a premium look on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
            <p className="inline-block px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm font-bold tracking-[0.3em] uppercase">
              Verified Results • 2024-2025
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
