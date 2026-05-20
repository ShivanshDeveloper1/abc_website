"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-red-100 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              ABC Institute
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Our institute focuses on strong concepts, disciplined preparation,
              and expert guidance to help students achieve top ranks in
              competitive exams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              {/* <li>
                <a
                  href="https://port.saharanpurprice.in"
                  target="_blank"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  Portfolio
                </a>
              </li> */}
              <li>
                <a
                  href="/contact"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/courses"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  IIT-JEE
                </a>
              </li>
              <li>
                <a
                  href="courses"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  Academics Classes-1st to 12th (all subjects)
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  NEET-UG
                </a>
              </li>
              <li>
                <a
                  href="/ielts"
                  className="hover:text-red-600 transition-colors duration-300"
                >
                  ILETS | PTE | SPOKEN ENGLISH
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Call to Action */}
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Stay Connected
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email"
                suppressHydrationWarning={true}
                className="w-full px-4 py-2 bg-slate-50 border border-red-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                suppressHydrationWarning={true} // <-- Add here too just in case
                className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors duration-300 font-medium"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-red-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Designed & Developed by Shivansh |{" "}
            <a
              href="https://webcontractor.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline hover:text-red-700 transition"
            >
              View Portfolio
            </a>
          </p>

          {/* Social Icons Placeholder */}
        <div className="flex space-x-5 mt-4 md:mt-0">
  <a
    href="https://www.facebook.com/shahidansaribiology"
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-300 hover:text-red-600 transition-colors duration-300"
  >
    <span className="sr-only">Facebook</span>
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  </a>
  <a
    href="https://www.instagram.com/abc_institute/reels"
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-300 hover:text-red-600 transition-colors duration-300"
  >
    <span className="sr-only">Instagram</span>
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  </a>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
