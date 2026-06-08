import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/(Homepage)/Navbar";
import WhatsappFloat from "@/components/Whatsapp";
import NavbarProvider from "@/components/Provider/NavbarProvider";
import Footer from "@/components/(Homepage)/Footer";

import FooterProvider from "@/components/Provider/FooterProvider";
import { cn } from "@/lib/utils";
import { QuizProvider } from "@/context/QuizContext";
import { AuthProvider } from "@/context/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abcinstitute.org"),
  // ❌ REMOVED alternates: { canonical: "/" } 
  title: {
    default: "ABC Institute | Best NEET & JEE Coaching in Saharanpur",
    template: "%s | ABC Institute Saharanpur",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  verification: {
    google: "5VbBJUGy_j0l3gOE0Wbf3uLeSThPrUm0rry1oDhSKV8",
  },
  description:
    "ABC Institute Saharanpur is the best coaching institute for NEET, JEE (IIT), and foundation classes from Class 8 to 12. Join Saharanpur’s top-rated institute with expert faculty, test series, and online classes.",
  keywords: [
    "best NEET coaching in Saharanpur",
    "best JEE coaching in Saharanpur",
    "IIT JEE coaching Saharanpur",
    "abc institute saharanpur",
    "NEET coaching institute Saharanpur",
    "top coaching institute in Saharanpur",
    "IIT JEE mains advanced Saharanpur",
    "NEET UG preparation Saharanpur",
    "best coaching for medical in Saharanpur",
    "best IIT coaching in Saharanpur",
    "coaching classes in Saharanpur for NEET",
    "foundation course class 9 10 Saharanpur",
    "best institute for competitive exams in Saharanpur",
    "best coaching for NEET and JEE",
    "IIT JEE physics chemistry maths classes",
    "NEET biology coaching",
    "dropper batch for NEET preparation",
    "JEE mains crash course",
    "pre-foundation classes for IIT JEE",
    "top rated academy for NEET UG",
    "engineering entrance exam preparation",
    "medical entrance exam test series"
  ],
  openGraph: {
    title: "Best NEET & JEE Coaching in Saharanpur | ABC Institute",
    description: "Join ABC Institute Saharanpur for NEET, JEE (IIT) coaching from Class 8 to 12 and droppers batch.",
    // ❌ REMOVED url: "https://abcinstitute.org"
    siteName: "ABC Institute Saharanpur",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABC Institute Classroom in Saharanpur",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABC Institute Saharanpur",
    description: "Affordable and trusted education for Saharanpur students.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
     
    <html lang="en" className={cn("font-sans", geist.variable)}>
     
      <body className={`${inter.variable} antialiased`}>
          <QuizProvider>
        {/* <Navbar /> */}
        <NavbarProvider />
        {children}
        <WhatsappFloat />
        <FooterProvider />
         </QuizProvider>
      </body>
     
    </html>
    </AuthProvider>
  );
}
