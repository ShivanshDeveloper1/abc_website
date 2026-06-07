import Script from "next/script";
import Courses from "@/components/(courses)/courses";
import CenterVid from "@/components/(Homepage)/Center";
import Carousel from "@/components/(Homepage)/Courosol";
import HomePage from "@/components/(Homepage)/HomePage";
import Reviews from "@/components/(Homepage)/Reviews";

// We remove the static title here so it inherits perfectly from layout.tsx
// This fixes the squished "abcinstitute.orgBest..." issue on Google.
export const metadata = {
  description:
    "ABC Institute is Saharanpur Uttar Pradesh's trusted coaching institute for IIT-JEE, NEET, foundation, and board exam preparation.",
};

export default function Home() {
  // We use an array to pass MULTIPLE schemas at once to Google
  const jsonLd = [
    {
      // 1. Organization Schema (Who you are, what you offer)
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
          description: "Medical entrance exam preparation in Saharanpur.",
        },
        {
          "@type": "Course",
          name: "IIT-JEE Preparation",
          description: "Engineering entrance exam coaching in Saharanpur.",
        },
      ],
    },
    {
      // 2. WebSite Schema (Enables the Sitelinks Search Box on Google)
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ABC Institute Saharanpur",
      url: "https://abcinstitute.org/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://abcinstitute.org/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      // 3. Site Navigation Schema (Breadcrumbs/Sitelinks based on your Sitemap)
      // This tells Google exactly which links to prioritize under your homepage
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Courses & Batches",
          url: "https://abcinstitute.org/courses",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Online Test Series",
          url: "https://abcinstitute.org/test-series",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "NEET 2026 Results",
          url: "https://abcinstitute.org/neet/results-2026",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "JEE 2026 Results",
          url: "https://abcinstitute.org/jee/results-2026",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Student Store",
          url: "https://abcinstitute.org/store",
        },
      ],
    }
  ];

  return (
    <main>
      <Script
        id="schema-org"
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