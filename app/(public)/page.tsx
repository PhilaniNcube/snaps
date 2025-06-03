import FeaturedGallery from "@/components/gallery/featured-gallery";
import Hero from "@/components/hero";
import WhyChooseUs from "@/components/home-cta/why-choose-us";
import ServicesOverview from "@/components/services/services-overview";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ArrowRight, Camera, ImageIcon, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <Hero />
        {/* Features Section */}
        <FeaturedGallery />
        {/* Services Overview Section */}
        <ServicesOverview />
        {/* Why Choose Us Section */}
        <WhyChooseUs />
      </div>
    </>
  );
}
