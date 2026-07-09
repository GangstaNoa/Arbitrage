import { notFound } from "next/navigation";
import ChapterView from "@/components/manual/ChapterView";
import chapters from "@/data/chapters.json";
import type { Chapter } from "@/lib/types";

export function generateStaticParams() {
  return (chapters as Chapter[]).map((c) => ({ slug: c.slug }));
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = (chapters as Chapter[]).find((c) => c.slug === params.slug);
  if (!chapter) notFound();
  return <ChapterView chapter={chapter} />;
}
