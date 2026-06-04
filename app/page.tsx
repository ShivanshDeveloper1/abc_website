import Script from "next/script";
import Courses from "@/components/(courses)/courses";
import CenterVid from "@/components/(Homepage)/Center";
import Carousel from "@/components/(Homepage)/Courosol";
import HomePage from "@/components/(Homepage)/HomePage";
import Reviews from "@/components/(Homepage)/Reviews";

export const metadata = {
  title:
    "Best NEET & JEE Coaching Institute in Saharanpur, Uttar Pradesh",

  description:
    "ABC Institute is Saharanpur Uttar Pradesh's trusted coaching institute for IIT-JEE, NEET, foundation, and board exam preparation.",

  keywords: [
    "best coaching institute in Saharanpur",
    "NEET coaching in Saharanpur",
    "JEE coaching in Saharanpur",
    "IIT JEE coaching Saharanpur",
    "Saharanpur Uttar Pradesh coaching",
    "best academy in Saharanpur",
  ],
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",

    name: "ABC Institute",

    url: "https://abcinstitute.org",

    logo: "https://abcinstitute.org/og-image.jpg",

    image: "https://abcinstitute.org/og-image.jpg",

    description:
      "ABC Institute is a top-rated coaching institute in Saharanpur, Uttar Pradesh specializing in NEET, IIT-JEE, foundation, and board exam preparation.",

    address: {
      "@type": "PostalAddress",
      addressLocality: "Saharanpur",
      addressRegion: "Uttar Pradesh",
      addressCountry: "India",
    },

    areaServed: {
      "@type": "City",
      name: "Saharanpur",
    },

    keywords:
      "NEET coaching Saharanpur, JEE coaching Saharanpur, IIT coaching Saharanpur, coaching institute in Saharanpur",

    telephone: "+91-7618550475",

    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7618550475",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
    },

    sameAs: [
      "https://www.instagram.com/",
      "https://www.youtube.com/",
    ],

    offers: [
      {
        "@type": "Course",
        name: "NEET Preparation",
        description:
          "Medical entrance exam preparation in Saharanpur.",
      },
      {
        "@type": "Course",
        name: "IIT-JEE Preparation",
        description:
          "Engineering entrance exam coaching in Saharanpur.",
      },
    ],
  };

  return (
    <main>
      <script
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