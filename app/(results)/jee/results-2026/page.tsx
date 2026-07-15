"use client";

import React, { useState } from "react";
import results from "@/data/toppers.json";
import Image from "next/image";
import { motion } from "framer-motion";
import ContactComing from "@/components/(Homepage)/ContactComing";

const Page = () => {
  // 1. FILTERING THE DATA
  // We only want items where the course is exactly "JEE"

      const [open, setOpen] = useState(false);
  

  const jeeResults = results.filter((res) => res.course === "JEE");

  const banners = [
    // { src: "/result/JEE/neet.jpeg", alt: "JEE Results" },
    { src: "/result/JEE/jeeResult.jpeg", alt: "Result Both 2" },
    { src: "/result/JEE/Jee.jpeg", alt: "Result Both 3" },
    // { src: "/result/JEE/2.png", alt: "Result Both 3" },
    // { src: "/result/JEE/3.png", alt: "Result Both 4" },
    // { src: "/result/JEE/4.png", alt: "Combined Results" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-200">
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
              JEE Results
            </p>
          </div>

          <div className="flex-1 py-10 px-8 md:py-16 md:px-14 flex flex-col justify-center">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-3">
              🔥 Batch Starting Soon
            </span>

            <h1 className="text-3xl md:text-5xl text-slate-900 font-extrabold leading-[1.2] mb-6">
              500+ hours of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                LIVE classes
              </span>
              ,
              <br className="hidden md:block" /> specially for fast-paced prep.
            </h1>

            <p className="text-slate-500 text-lg mb-10 max-w-2xl leading-relaxed">
              Join thousands of top JEE rankers. Get access to premium study
              material and personalized doubt solving.
            </p>

            <div className="flex flex-col xl:flex-row gap-10 xl:items-center justify-between">
              <div className="flex gap-4 md:gap-6 flex-wrap items-center">
                {/* 2. MAPPING THE FILTERED DATA */}
                {jeeResults.slice(0, 5).map((res, index) => (
                  <div
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                    key={index}
                  >
                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg transform transition-all duration-300 group-hover:scale-110">
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

                <div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 border-white transform transition-transform hover:scale-105 cursor-pointer">
                  <p className="text-xl md:text-2xl font-black text-white leading-none">
                    +{jeeResults.length > 5 ? jeeResults.length - 5 : 0}
                  </p>
                  <p className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider mt-1">
                    JEE Ranks
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

      {/* 2. HALL OF FAME - ANIMATED MASONRY */}
      <section className="w-full bg-[#8b0000] py-20 px-4 border-t-8 border-blue-600 flex flex-col items-center">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              OUR JEE <span className="text-amber-400">LEGACY</span>
            </h2>
            <div className="h-1.5 w-32 bg-amber-400 mx-auto mb-6 rounded-full"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {banners.map((banner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hover:border-amber-400 transition-all duration-500"
              >
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Page;
