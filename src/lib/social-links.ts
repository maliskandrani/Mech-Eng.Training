export const SOCIAL_LINK_FIELDS = [
  { name: "socialYoutubeUrl", label: "يوتيوب (YouTube)", placeholder: "https://youtube.com/@skillstream" },
  { name: "socialFacebookUrl", label: "فيسبوك (Facebook)", placeholder: "https://facebook.com/SkillStreamAcademy" },
  { name: "socialTwitterUrl", label: "إكس (Twitter/X)", placeholder: "https://x.com/skillstream" },
  { name: "socialLinkedinUrl", label: "لينكدإن (LinkedIn)", placeholder: "https://linkedin.com/company/skillstream" },
] as const;

export type SocialLinkFieldName = (typeof SOCIAL_LINK_FIELDS)[number]["name"];
