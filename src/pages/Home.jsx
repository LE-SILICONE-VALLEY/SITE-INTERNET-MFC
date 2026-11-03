import React from "react";
import GuidedHome from "@/components/sections/GuidedHome";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import siteConfig from "@/config/siteConfig";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import CtaSection from "@/components/sections/CtaSection";
import Contact from "@/components/sections/Contact";
import Partners from "@/components/sections/Partners";
import PageTransition from "@/components/layout/PageTransition";

const Home = ({ showToast }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageTransition>
      <GuidedHome />

      <div id="main-content" className="bg-white">
        <div className="section-padding bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  {siteConfig.homePage.intro.title}
                </h2>

                <p className="text-lg text-gray-600">
                  {siteConfig.homePage.intro.description}
                </p>

                <Button asChild size="lg" className="btn-primary mt-8">
                  <Link to="/a-propos">En savoir plus sur nous</Link>
                </Button>
              </div>

              <div>
                <img
                  alt={siteConfig.homePage.intro.image.alt}
                  className="rounded-lg shadow-xl"
                  src={siteConfig.homePage.intro.image.src}
                />
              </div>
            </div>
          </div>
        </div>

        <Services showToast={showToast} />
        <Partners />
        <Testimonials />
        <CtaSection scrollToSection={scrollToSection} />

        <div id="contact">
          <Contact showToast={showToast} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
