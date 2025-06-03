import Link from "next/link";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="container relative z-10 flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
          Capturing the Moments That{" "}
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text ">
            Shape Their School Story
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
          From bright smiles in class photos to the triumphant spirit of school
          events, we preserve the memories that matter most.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/galleries">
            <Button size="lg" className="gap-2 text-lg px-8 py-6">
              View Our School Galleries <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More About Our Services
            </Button>
          </Link>
          <Link href="/book">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Book Your School's Photo Day
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
