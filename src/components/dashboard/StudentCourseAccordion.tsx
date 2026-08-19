"use client";

import { useState } from "react";
import Image from "next/image";
import { MATERIAL_TYPE_ICONS, MATERIAL_TYPE_LABELS, formatDuration, arabicCount } from "@/lib/utils";

type Material = {
  id: string;
  title: string;
  type: "BOOK" | "VIDEO" | "SLIDE";
  durationMinutes: number | null;
  isFree: boolean;
};

type Lesson = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  materials: Material[];
};

type Section = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  lessons: Lesson[];
};

export default function StudentCourseAccordion({ sections }: { sections: Section[] }) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(sections[0] ? [sections[0].id] : []));
  const allOpen = sections.length > 0 && sections.every((s) => openSet.has(s.id));

  function toggle(id: string) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setOpenSet(allOpen ? new Set() : new Set(sections.map((s) => s.id)));
  }

  return (
    <div>
      <div className="flex justify-end">
        <button type="button" onClick={toggleAll} className="text-sm font-semibold text-accent-soft hover:underline">
          {allOpen ? "طي الكل" : "فتح الكل"}
        </button>
      </div>

      <div className="mt-2 space-y-3">
        {sections.map((section) => {
          const lessonsCount = section.lessons.length;
          const totalMaterials = section.lessons.reduce((n, l) => n + l.materials.length, 0);
          const hasContent = totalMaterials > 0;
          const minutes = section.lessons.reduce(
            (n, l) => n + l.materials.reduce((m, mat) => m + (mat.durationMinutes ?? 0), 0),
            0
          );
          const duration = formatDuration(minutes);
          const isOpen = openSet.has(section.id);

          return (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center gap-4 bg-background-elevated px-4 py-4 text-start transition hover:bg-background-elevated/80"
              >
                {section.coverImageUrl && (
                  <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
                    <Image
                      src={section.coverImageUrl}
                      alt=""
                      width={44}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span className="flex-1 font-bold text-foreground">{section.title}</span>
                {hasContent ? (
                  <span className="flex shrink-0 items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">📖 {arabicCount(lessonsCount, "درس", "درسان", "دروس")}</span>
                    {duration && <span className="flex items-center gap-1">⏱️ {duration}</span>}
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted">
                    🕒 قريبًا
                  </span>
                )}
                <span className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="divide-y divide-border border-t border-border">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {lesson.coverImageUrl && (
                          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
                            <Image
                              src={lesson.coverImageUrl}
                              alt=""
                              width={48}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                      </div>
                      {lesson.materials.length > 0 ? (
                        <ul className="mt-2 space-y-1.5">
                          {lesson.materials.map((mat) => (
                            <li
                              key={mat.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-sm"
                            >
                              <span className="text-foreground">
                                {MATERIAL_TYPE_ICONS[mat.type] ?? ""} {mat.title}
                                {mat.isFree && (
                                  <span className="ms-2 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent-soft">
                                    🎁 مجانية
                                  </span>
                                )}
                              </span>
                              <div className="flex items-center gap-2">
                                {formatDuration(mat.durationMinutes) && (
                                  <span className="text-xs text-muted">{formatDuration(mat.durationMinutes)}</span>
                                )}
                                <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                                  {MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}
                                </span>
                                <a
                                  href={`/api/files/${mat.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-soft transition hover:bg-accent/20"
                                >
                                  {mat.type === "VIDEO" ? "مشاهدة" : "فتح / تحميل"}
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted">
                          🕒 قريبًا
                        </span>
                      )}
                    </div>
                  ))}
                  {section.lessons.length === 0 && (
                    <div className="p-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted">
                        🕒 قريبًا
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
