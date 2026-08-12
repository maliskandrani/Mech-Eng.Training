"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = { id: string; imageUrl: string; caption: string | null };

export default function StoryCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-elevated shadow-lg">
      <div className="relative aspect-[16/7] w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={slide.imageUrl} alt={slide.caption ?? ""} fill className="object-cover" />
          </div>
        ))}
        {slides[index]?.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-4 pt-10">
            <p className="text-sm font-semibold text-navy-foreground">{slides[index].caption}</p>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setIndex(i)}
              aria-label={`slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
