import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Companies } from "@/components/sections/Companies";
import { TechStack } from "@/components/sections/TechStack";
import { Journey } from "@/components/sections/Journey";
import { Numbers } from "@/components/sections/Numbers";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Courses } from "@/components/sections/Courses";
import { Benefits } from "@/components/sections/Benefits";
import { Instructors } from "@/components/sections/Instructors";
import { Community } from "@/components/sections/Community";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

/** A colored band wrapping one or more sections, with optional floating lights. */
function Band({
  className = "",
  children,
  blobs,
}: {
  className?: string;
  children: ReactNode;
  blobs?: { className: string }[];
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {blobs?.map((b, i) => (
        <span key={i} className={`blob ${b.className}`} aria-hidden />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

const Divider = () => <div className="band-divider" aria-hidden />;

export function LandingPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero keeps its own forge backdrop */}
        <Hero />

        <Divider />
        <Band
          className="band-char"
          blobs={[{ className: "left-[-6rem] top-10 h-72 w-72 bg-ember-700/15 animate-float" }]}
        >
          <Companies />
          <TechStack />
        </Band>

        <Divider />
        <Band
          className="band-warm"
          blobs={[{ className: "right-[-8rem] top-1/3 h-80 w-80 bg-ember-600/12 animate-pulse-glow" }]}
        >
          <Journey />
        </Band>

        <Divider />
        {/* Bold ember band — the strongest color shift */}
        <Band
          className="band-ember"
          blobs={[
            { className: "left-1/4 top-[-4rem] h-64 w-64 bg-ember-500/20 animate-float" },
            { className: "right-1/4 bottom-[-4rem] h-64 w-64 bg-ember-700/20 animate-pulse-glow" },
          ]}
        >
          <Numbers />
        </Band>

        <Divider />
        <Band className="band-dark">
          <HowItWorks />
          <Courses />
        </Band>

        <Divider />
        <Band
          className="band-char"
          blobs={[{ className: "left-[-6rem] bottom-10 h-72 w-72 bg-ember-800/12 animate-float" }]}
        >
          <Benefits />
          <Instructors />
        </Band>

        <Divider />
        <Band className="band-warm">
          <Community />
        </Band>

        <Divider />
        <Band
          className="band-dark"
          blobs={[{ className: "right-[-6rem] top-1/4 h-72 w-72 bg-ember-600/10 animate-pulse-glow" }]}
        >
          <Testimonials />
        </Band>

        <Divider />
        {/* Ember band again for pricing emphasis */}
        <Band
          className="band-ember"
          blobs={[{ className: "left-1/2 top-[-4rem] h-72 w-72 -translate-x-1/2 bg-ember-500/18 animate-pulse-glow" }]}
        >
          <Pricing />
        </Band>

        <Divider />
        <Band className="band-dark">
          <Faq />
        </Band>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
