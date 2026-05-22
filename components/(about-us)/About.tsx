"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Target, Rocket, Award } from "lucide-react";

const founders = [
  {
    name: "Mr. Shahid Ansari",
    title: "Founder of ABC Institutes",
    src: "/sirji.png",
    bio: "Visionary leader dedicated to transforming the educational landscape of Saharanpur through innovative teaching methodologies and excellence.",
  },
  {
    name: "Mr. Shakir Ansari",
    title: "Manager of ABC Institutes",
    src: "/Shakirans.jpeg",
    bio: "Expert in operational strategy and governance, ensuring that the institution maintains the highest standards of student welfare and administrative efficiency.",
  },
];



const Legacy = [
  { title: 'Proven outcomes', description: 'Multi All-saharanpur-1s and top results in major exams' },
  { title: 'Scale', description: 'Tens of thousands of faculty & staff millions of students coached across modes.' },
  { title: 'Trust', description: 'Results externally audited and validated; strong alumni in IITs, AIIMS & global universities.' },
  { title: 'Broader impact', description: 'Olympiad medals, national competitions, and strong school integration programs.' }
];

const About = () => {
  return (
    <main className="bg-slate-50 min-h-screen overflow-hidden">
      {/* ===== Inspiration Section ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-red-600 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Our Mentors
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
            Honouring Our <span className="text-red-600 italic">Inspiration</span>
          </h1>
          <div className="w-24 h-2 bg-red-600 mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col sm:flex-row items-center gap-6 md:gap-8 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100"
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
                <div className="absolute inset-0 bg-red-600 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-10" />
                <Image
                  src={founder.src}
                  alt={founder.name}
                  fill
                  className="object-cover object-top rounded-[2rem] shadow-inner border-2 border-white relative z-10"
                />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-1">
                  {founder.name}
                </h3>
                <p className="text-red-600 font-bold text-sm uppercase tracking-wide mb-3">
                  {founder.title}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed italic">
                  "{founder.bio}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Vision Section ===== */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-red-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 md:p-20 relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/10 blur-[80px] rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 md:mb-8">
                <Target className="w-4 h-4 text-red-200" />
                <span className="text-red-200 text-xs font-bold tracking-widest uppercase">
                  The Future
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 md:mb-8">
                Our Vision for <br />
                <span className="text-red-300 italic font-serif">Education</span>
              </h2>

              <div className="space-y-6 md:space-y-8">
                <div className="flex gap-4 sm:gap-5 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-700 transition-colors duration-300">
                    <Rocket className="w-6 h-6 text-red-300 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">
                      Democratizing Access
                    </h4>
                    <p className="text-red-100/70 text-sm leading-relaxed">
                      Breaking geographical and financial boundaries to ensure every corner of India has access to premium learning tools.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-5 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-700 transition-colors duration-300">
                    <Award className="w-6 h-6 text-red-300 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">
                      Uncompromising Quality
                    </h4>
                    <p className="text-red-100/70 text-sm leading-relaxed">
                      Delivering a standard of education that competes globally, while remaining the most affordable option locally.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full"
            >
              <div className="relative z-10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10">
                <Image
                  src="/result/Neet/neetRanker.jpeg"
                  alt="Students Learning"
                  width={1200}
                  height={800}
                  className="object-contain h-auto w-full hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-3xl -z-0 blur-2xl opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Legacy & Impact Section (Fixed & Optimized) ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-12">
          Legacy & Impact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Legacy.map((leg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-xl text-slate-900 mb-2">{leg.title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{leg.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* Offerings */}

      <section>
        <p>Our <span className="text-blue-600">Offerings</span></p>

        <p></p>
      </section>





      {/* ===== Leadership Summary ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 md:mb-8">
              Leadership & Governance
            </h2>
            <p className="text-slate-500 text-base md:text-xl leading-relaxed font-medium">
              We operate with total transparency. Our board ensures we stay true to our primary mission:
              <span className="text-red-600 underline decoration-blue-200 underline-offset-4 block sm:inline mt-2 sm:mt-0 ml-0 sm:ml-2">
                Empowering the next generation.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Contact Form Section ===== */}
      <section className="pb-24 px-4 sm:px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-10 md:p-12 border border-slate-100"
        >
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Join the Mission
            </h2>
            <p className="text-slate-500 font-medium">
              Have questions? We're here to help.
            </p>
          </div>

          <form className="space-y-4 md:space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 transition-all outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 transition-all outline-none"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 transition-all outline-none resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#b91c1c" }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-red-600 text-white py-4 md:py-5 rounded-xl font-bold text-lg shadow-xl shadow-red-200 transition-all"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </section>
    </main>
  );
};

export default About;