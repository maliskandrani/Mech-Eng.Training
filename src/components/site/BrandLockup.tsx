import { getTranslations } from "next-intl/server";
import Logo from "@/components/site/Logo";

export default async function BrandLockup({
  logoUrl,
  size = 44,
  nameClassName = "",
  translatedClassName = "",
  hideTextOnMobile = false,
}: {
  logoUrl?: string | null;
  size?: number;
  nameClassName?: string;
  translatedClassName?: string;
  hideTextOnMobile?: boolean;
}) {
  const tBrand = await getTranslations("brand");
  const translatedName = tBrand("translatedName");

  return (
    <div className="flex items-center gap-2.5">
      <Logo logoUrl={logoUrl} size={size} />
      <div className={`leading-tight ${hideTextOnMobile ? "hidden sm:block" : ""}`}>
        <p className={`font-extrabold ${nameClassName}`}>SkillStream Academy</p>
        {translatedName !== "SkillStream Academy" && (
          <p className={`text-xs ${translatedClassName}`}>{translatedName}</p>
        )}
      </div>
    </div>
  );
}
