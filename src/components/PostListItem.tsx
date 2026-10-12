import * as React from "react";
import { Calendar, FileText } from "lucide-react";

export interface PostListItemProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  thumbnail?: string;
  preview?: {
    heading?: string;
    snippets: string[];
  };
}

export function PostListItem({
  title,
  description,
  date,
  slug,
  thumbnail,
  preview,
}: PostListItemProps) {
  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Left: Representative Image or Notion Page Preview */}
        <a
          href={`/blog/${slug}`}
          className="relative w-full sm:w-48 md:w-56 shrink-0 aspect-video rounded-lg overflow-hidden border border-border bg-card flex flex-col justify-start focus:outline-none focus:ring-2 focus:ring-ring text-left"
          aria-label={title}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="relative h-full w-full bg-card p-3 overflow-hidden select-none flex flex-col justify-between transition-transform duration-300 ease-out group-hover:scale-105">
              <div className="space-y-1.5">
                {/* Mini Notion Document Header */}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-3 w-3 shrink-0" />
                  <span className="font-semibold text-xs text-foreground truncate">
                    {preview?.heading || title}
                  </span>
                </div>

                {/* Mini Page Content Lines */}
                <div className="space-y-1 text-xs text-muted-foreground/80 leading-relaxed">
                  {preview?.snippets && preview.snippets.length > 0 ? (
                    preview.snippets.map((snippet, idx) => (
                      <p key={idx} className="line-clamp-2">
                        {snippet}
                      </p>
                    ))
                  ) : (
                    <p className="line-clamp-3">{description}</p>
                  )}
                </div>
              </div>

              {/* Bottom fade mask to mimic Notion document peek */}
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </div>
          )}
        </a>

        {/* Right: Vertical details */}
        <div className="flex flex-1 flex-col justify-between min-w-0 w-full sm:self-stretch">
          <div className="space-y-1.5">
            {/* 1. Title */}
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              <a
                href={`/blog/${slug}`}
                className="hover:text-primary transition-colors focus:outline-none focus:underline"
              >
                {title}
              </a>
            </h2>

            {/* 2. One-line description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* 3. Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 sm:pt-0">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
