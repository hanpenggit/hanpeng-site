import { profile } from "@/lib/profile";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { ExperienceSection } from "@/components/work/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { StackSection } from "@/components/stack/StackSection";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <ChatProvider chatbot={profile.chatbot}>
      <Nav />
      <main
        id="top"
        className="main-pad"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}
      >
        <Hero />
        <ExperienceSection
          companies={profile.experience}
          education={profile.education}
        />
        <ProjectsSection />
        <StackSection />
        <ContactSection />
      </main>
      <Footer />
    </ChatProvider>
  );
}
