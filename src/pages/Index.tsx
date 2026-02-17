import SpotlightHero from "@/components/SpotlightHero";
import LoadingScreen from "@/components/LoadingScreen";
import ProjectCard from "@/components/ProjectCard";
import { Stethoscope, Brain, Camera, Heart, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <main>
      <LoadingScreen />
      <SpotlightHero />

      {/* Spacer between hero and projects */}
      <div className="h-16 md:h-24 bg-background" />

      {/* Projects Section */}
      <section className="bg-background pb-12 md:pb-20 px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="font-display text-muted-foreground text-sm tracking-[0.2em] uppercase mt-2">
            Featured Work
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-md mx-auto">
          <ProjectCard
            icon={<Stethoscope size={28} className="text-foreground" />}
            title="Digital Nurse"
            subtitle="Clinical Reference App"
            description="Evidence-based nursing procedures, clinical calculators, and professional healthcare resources. Built for healthcare professionals."
            tags={["Clinical Procedures", "Medical Calculators", "Drug References", "AI Assistant"]}
            ctaLabel="Explore the App"
            ctaIcon={<Heart size={18} />}
            href="https://digital-nurse-buddy.lovable.app/home"
          />

          <ProjectCard
            icon={<Brain size={28} className="text-foreground" />}
            title="Kidinnu AI"
            subtitle="AI-Powered Assistant"
            description="Advanced AI assistant powered by cutting-edge language models. Create, explore, and innovate with intelligent conversation."
            tags={["Smart Conversations", "Creative Writing", "Problem Solving", "Knowledge Base"]}
            ctaLabel="Try Kidinnu AI"
            ctaIcon={<Sparkles size={18} />}
            href="https://kidinnu.netlify.app/"
          />

          <ProjectCard
            icon={<Camera size={28} className="text-foreground" />}
            title="ItemValue"
            subtitle="AI Price Estimator"
            description="Know how much your used items are worth in seconds. Just take a photo — it identifies the type and condition, then gives you a fair price in Iraqi dinars."
            tags={["Photo Recognition", "Price Estimation", "Condition Analysis", "Province-Based"]}
            ctaLabel="Try ItemValue"
            ctaIcon={<Sparkles size={18} />}
            href="https://itemvalue.lovable.app/"
          />
        </div>
      </section>

      {/* Social Footer */}
      <SocialFooter />
    </main>
  );
};

const SocialFooter = () => {
  const socials = [
    { label: "Instagram", href: "https://instagram.com/staiiq", icon: <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg> },
    { label: "Twitter", href: "https://twitter.com/3h0ll7", icon: <svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg> },
    { label: "YouTube", href: "https://youtube.com/@stai9", icon: <svg width="24" height="24" viewBox="0 0 576 512" fill="currentColor"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> },
    { label: "GitHub", href: "https://github.com/3h0ll7", icon: <svg width="24" height="24" viewBox="0 0 496 512" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.8-14.9-112.8-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/></svg> },
    { label: "Facebook", href: "https://www.facebook.com/share/1SXTmx3Zcj/", icon: <svg width="24" height="24" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg> },
    { label: "TikTok", href: "https://linktr.ee/3h0ll", icon: <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg> },
    { label: "Letterboxd", href: "https://boxd.it/7RQST", icon: <svg width="24" height="24" viewBox="0 0 500 500" fill="currentColor"><circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="40"/><circle cx="175" cy="250" r="60"/><circle cx="325" cy="250" r="60"/></svg> },
  ];

  return (
    <div className="bg-background flex justify-center gap-5 md:gap-6 pb-12 md:pb-16 pt-4 flex-wrap px-4 md:px-6">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
};

export default Index;
