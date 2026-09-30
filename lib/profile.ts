import data from "@/content/profile.json";
import type { Profile } from "./types";

// Single typed import of the source-of-truth content. Components and the
// chatbot system prompt both read from this — never hard-code copy.
export const profile = data as Profile;

export const skillGroups = Object.entries(profile.skills).map(
  ([name, items]) => ({ name, items }),
);
