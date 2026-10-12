export interface PagePreview {
  heading?: string;
  snippets: string[];
}

/**
 * Extracts a Notion-like text preview from the beginning of a markdown body.
 */
export function extractPagePreview(body: string, maxSnippets = 3): PagePreview {
  if (!body) return { snippets: [] };

  // Remove frontmatter if present
  const cleanBody = body.replace(/^---[\s\S]*?---\s*/, "");

  const lines = cleanBody
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.length > 0 &&
        !l.startsWith("```") &&
        !l.startsWith("![") &&
        !l.startsWith(">") &&
        !l.startsWith("|") &&
        !l.startsWith("---")
    );

  let heading = "";
  const snippets: string[] = [];

  for (const line of lines) {
    if ((line.startsWith("# ") || line.startsWith("## ")) && !heading) {
      heading = line.replace(/^#+\s*/, "").trim();
      continue;
    }

    const clean = line
      .replace(/^#+\s*/, "")
      .replace(/^[-*+]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "")
      .replace(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g, "$2")
      .trim();

    if (clean) {
      snippets.push(clean);
    }

    if (snippets.length >= maxSnippets) {
      break;
    }
  }

  return {
    heading: heading || undefined,
    snippets,
  };
}
