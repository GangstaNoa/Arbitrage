import { notFound } from "next/navigation";
import ChapterView from "@/components/manual/ChapterView";
import chaptersEn from "@/data/chapters.json";
import chaptersFo from "@/data/chapters.fo.json";
import type { Chapter } from "@/lib/types";

export function generateStaticParams() {
  return (chaptersEn as Chapter[]).map((c) => ({ slug: c.slug }));
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapterEn = (chaptersEn as Chapter[]).find((c) => c.slug === params.slug);
  const chapterFo = (chaptersFo as Chapter[]).find((c) => c.slug === params.slug);
  if (!chapterEn || !chapterFo) notFound();
  return <ChapterView chapterEn={chapterEn} chapterFo={chapterFo} />;
}
