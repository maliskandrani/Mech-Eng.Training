import Image from "next/image";

export default function Logo({ logoUrl, size = 36 }: { logoUrl?: string | null; size?: number }) {
  if (logoUrl) {
    return (
      <span
        className="relative shrink-0 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image src={logoUrl} alt="SkillStream Academy" fill className="object-contain" />
      </span>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0" aria-hidden>
      <polygon
        points="50,4 93,27 93,73 50,96 7,73 7,27"
        fill="#142850"
        stroke="#d4af37"
        strokeWidth="4"
      />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="38"
        fontWeight="bold"
        fill="#d4af37"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
}
