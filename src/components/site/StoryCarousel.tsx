"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = { id: string; imageUrl: string };

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
    <div className="relative w-full overflow-hidden bg-navy">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7] lg:aspect-[21/7]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={slide.imageUrl} alt="" fill className="object-contain" priority={i === 0} />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 top-3 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setIndex(i)}
              aria-label={`slide ${i + 1}`}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold backdrop-blur-sm transition ${
                i === index ? "bg-accent text-accent-foreground" : "bg-black/30 text-white/70 hover:bg-black/50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
