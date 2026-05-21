import Script from "next/script";
import Courses from "@/components/(courses)/courses";
import CenterVid from "@/components/(Homepage)/Center";
import Carousel from "@/components/(Homepage)/Courosol";
import HomePage from "@/components/(Homepage)/HomePage";
import Reviews from "@/components/(Homepage)/Reviews";

export const metadata = {
  title: "Best Coaching for NEET & JEE in Saharanpur",
  description: "ABC Institute is Saharanpur's most trusted education platform for IIT-JEE, NEET, and Foundation courses. Enroll today.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ABC Institute",
    "url": "https://abcinstitute.org",
    "logo": "https://abcinstitute.org/og-image.jpg",
    "description": "Top-rated coaching institute in Saharanpur specializing in NEET, IIT-JEE, and foundation batches for Class 8 to 12.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Saharanpur",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7618550475",
      "contactType": "Admissions and Inquiry",
      "availableLanguage": ["English", "Hindi"]
    },
    "offers": [
      {
        "@type": "Course",
        "name": "NEET Preparation",
        "description": "Comprehensive medical entrance exam preparation."
      },
      {
        "@type": "Course",
        "name": "IIT-JEE Preparation",
        "description": "Engineering entrance exam coaching and test series."
      }
    ]
  };

  return (
    <main>
      {/* JSON-LD Schema Injection */}
      <Script
        id="institute-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Carousel />
      <HomePage />
      <Reviews />
      <CenterVid />
      <Courses />
    </main>
  );
}