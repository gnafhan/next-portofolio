export function Video({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <video src={src} poster={poster} controls playsInline preload="metadata" className="w-full rounded-[20px] border border-line" />
      {caption && <figcaption className="mt-2 text-[0.88rem] text-ink-3">{caption}</figcaption>}
    </figure>
  );
}

export function YouTube({ id, title = "Video" }: { id: string; title?: string }) {
  return (
    <div className="not-prose my-8 aspect-video overflow-hidden rounded-[20px] border border-line">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}

export function Img(props: React.ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img loading="lazy" decoding="async" {...props} />;
}
