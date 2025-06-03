import { getFeaturedPhotos } from "@/utils/queries/photos";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedGallery = async () => {
  const featuredPhotos = await getFeaturedPhotos(2); // Fetch or define your featured photos here

  return (
    <section className="py-16 bg-muted/30 ">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Creating a Visual Legacy for Your School Community
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              School days are filled with fleeting moments of laughter,
              learning, and friendship. At SchoolPrints, we specialize in
              capturing the essence of these precious years. We provide
              professional, vibrant photography services for schools, including
              classic individual portraits, lively group class photos, and
              dynamic coverage of your most memorable school events.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Let us help you create a visual legacy that students, parents, and
              educators will cherish for years to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Get Started Today <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {featuredPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET}${photo.image_url}`}
                    alt={photo.photo_reference_code}
                    className="object-cover transition-transform hover:scale-105"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGallery;
