import { profile } from "@/lib/profile";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { BuildSection } from "@/components/build/BuildSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { AiLabSection } from "@/components/ai-lab/AiLabSection";
import { ExperienceSection } from "@/components/work/ExperienceSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { NowSection } from "@/components/now/NowSection";
import { StackSection } from "@/components/stack/StackSection";
import { ContactSection } from "@/components/contact/ContactSection";

// V2 page order — identity first, proof of work next, tools last:
// Hero → What I Build → Projects → AI Lab → Experience → Philosophy → Now →
// Stack → Contact. Sections whose data is absent in profile.json hide
// themselves, so the order can stay fixed.
export default function Home() {
  return (
    <ChatProvider chatbot={profile.chatbot}>
      <Nav />
      <main
        id="top"
        className="main-pad"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px, 5vw, 32px)" }}
      >
        <Hero />
        <BuildSection />
        <ProjectsSection />
        <AiLabSection />
        <ExperienceSection
          companies={profile.experience}
          education={profile.education}
        />
        <PhilosophySection />
        <NowSection />
        <StackSection />
        <ContactSection />
      </main>
      <Footer />
    </ChatProvider>
  );
}
