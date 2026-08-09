function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url, "https://placeholder.local");
    if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function VideoEmbed({ url }: { url: string }) {
  const embed = toEmbedUrl(url);

  if (embed) {
    return (
      <iframe
        src={embed}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video src={url} controls className="h-full w-full bg-black" />
  );
}
