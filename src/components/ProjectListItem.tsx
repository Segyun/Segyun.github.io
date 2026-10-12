import * as React from "react";
import { Github, ExternalLink } from "lucide-react";

export interface ProjectListItemProps {
  title: string;
  description: string;
  slug: string;
  githubUrl?: string;
  demoUrl?: string;
  thumbnail?: string;
}

export function ProjectListItem({
  title,
  description,
  slug,
  githubUrl,
  demoUrl,
  thumbnail,
}: ProjectListItemProps) {
  return (
    <article className="group flex flex-col gap-3">
      {/* 1. 이미지 또는 썸네일 대체 플레이스홀더 */}
      <a
        href={`/projects/${slug}`}
        className="relative block aspect-video w-full rounded-lg overflow-hidden border border-border bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="flex h-full w-full items-center justify-center p-6 text-center transition-transform duration-300 ease-out group-hover:scale-105">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-secondary-foreground/60 group-hover:text-secondary-foreground/80 transition-colors line-clamp-2">
              {title}
            </span>
          </div>
        )}
      </a>

      {/* 2. 프로젝트 이름 및 외부 링크 */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          <a
            href={`/projects/${slug}`}
            className="hover:text-primary transition-colors focus:outline-none focus:underline"
          >
            {title}
          </a>
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              aria-label={`${title} GitHub repository`}
            >
              <Github className="h-4 w-4" />
            </a>
          ) : null}
          {demoUrl ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              aria-label={`${title} live demo`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* 3. 설명 */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {description}
      </p>
    </article>
  );
}
