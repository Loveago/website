import { clsx } from "clsx";

export function Avatar({ src, alt, className }: { src?: string | null; alt?: string; className?: string }) {
  return (
    <div className={clsx("h-20 w-20 overflow-hidden rounded-full bg-muted", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? "avatar"} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No Image</div>
      )}
    </div>
  );
}
