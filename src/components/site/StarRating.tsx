export default function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(rating);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`inline-flex items-center gap-0.5 text-accent ${textSize}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rounded ? "text-accent" : "text-border"}>
          ★
        </span>
      ))}
    </span>
  );
}
