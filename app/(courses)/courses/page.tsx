import MainCourse from "@/components/(courses)/MainCourse";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best NEET & IIT-JEE Coaching in Saharanpur | ABC Institute",
  description:
    "Secure your top rank with Saharanpur's leading NEET & IIT-JEE coaching. Expert faculty, high-yield test series, and structured batches. Book a free demo class today!",
  keywords: [
    "NEET coaching Saharanpur",
    "IIT JEE coaching Saharanpur",
    "best medical coaching in UP",
    "engineering entrance coaching Saharanpur",
    "ABC Institute courses",
    "JEE Mains advanced classes",
    "NEET dropper batch Saharanpur",
    "foundation courses class 9 to 12"
  ],
  alternates: {
    canonical: "https://abcinstitute.org/neet-jee-courses",
    languages: {
      "en-IN": "https://abcinstitute.org/neet-jee-courses",
      "hi-IN": "https://abcinstitute.org/hi/neet-jee-courses",
    },
  },
  openGraph: {
    title: "Best NEET & IIT-JEE Coaching in Saharanpur | ABC Institute",
    description:
      "Secure your top rank with Saharanpur's leading NEET & IIT-JEE coaching. Expert faculty, high-yield test series, and structured batches.",
    images: [
      {
        url: "https://abcinstitute.org/abc4.avif",
        width: 1200,
        height: 630,
        alt: "Students studying in NEET and JEE Classroom at ABC Institute Saharanpur",
      },
    ],
    url: "https://abcinstitute.org/neet-jee-courses",
    siteName: "ABC Institute",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best NEET & IIT-JEE Coaching in Saharanpur",
    description: "Secure your top rank with Saharanpur's leading NEET & IIT-JEE coaching.",
    images: ["https://abcinstitute.org/abc4.avif"],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ABC Institute",
    url: "https://abcinstitute.org",
    logo: "https://abcinstitute.org/logo.png",
    description: "Premier coaching institute for NEET and IIT-JEE preparation in Saharanpur.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Saharanpur City", 
      addressLocality: "Saharanpur",
      addressRegion: "Uttar Pradesh",
      postalCode: "247001",
      addressCountry: "IN",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://abcinstitute.org/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: "https://abcinstitute.org/courses",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "NEET & JEE Coaching",
        item: "https://abcinstitute.org/neet-jee-courses",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Complete NEET-UG Preparation Course",
    description: "Intensive coaching for NEET-UG covering Physics, Chemistry, and Biology with daily practice papers and mock tests.",
    provider: {
      "@type": "EducationalOrganization",
      name: "ABC Institute",
      sameAs: "https://abcinstitute.org",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IIT-JEE Mains & Advanced Masterclass",
    description: "Comprehensive engineering entrance preparation focusing on core concepts, advanced problem-solving, and time management.",
    provider: {
      "@type": "EducationalOrganization",
      name: "ABC Institute",
      sameAs: "https://abcinstitute.org",
    },
  }
];

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <MainCourse />
    </>
  );
};

export default Page;