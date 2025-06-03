import { Calendar, School, Users } from "lucide-react";
import React from "react";

const ServicesOverview = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Photography Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive photography solutions designed specifically for
            schools and educational institutions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm border">
            <div className="mb-4 p-3 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Individual Portraits</h3>
            <p className="text-muted-foreground leading-relaxed">
              Classic individual student portraits that capture each child's
              unique personality and bright smile.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm border">
            <div className="mb-4 p-3 rounded-full bg-primary/10">
              <School className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Class & Group Photos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Lively group photos that showcase the camaraderie and spirit of
              each class and grade level.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm border">
            <div className="mb-4 p-3 rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">School Events</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dynamic coverage of graduations, sports events, performances, and
              other memorable school occasions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
