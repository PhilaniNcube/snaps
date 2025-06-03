import { Camera, Heart, ImageIcon, School } from "lucide-react";
import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Schools Choose SchoolPrints
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We understand the unique needs of schools and provide a seamless
            photography experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit mx-auto">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Professional Quality</h3>
            <p className="text-sm text-muted-foreground">
              High-quality photography with professional lighting and equipment.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit mx-auto">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy Online Ordering</h3>
            <p className="text-sm text-muted-foreground">
              Simple online platform for parents to view and order photos.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit mx-auto">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Stress-Free Experience</h3>
            <p className="text-sm text-muted-foreground">
              We handle all the logistics so schools can focus on education.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit mx-auto">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">School-Focused</h3>
            <p className="text-sm text-muted-foreground">
              Specialized experience working with educational institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
