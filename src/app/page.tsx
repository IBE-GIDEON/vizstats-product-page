import { redirect } from "next/navigation";
import { projects } from "@/content/projects";

// The studio home page isn't built yet — land on the case study prototype.
export default function Home() {
  redirect(`/work/${projects[0].slug}`);
}
