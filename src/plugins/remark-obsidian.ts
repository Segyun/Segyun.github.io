import { visit } from 'unist-util-visit';
import type { Root, Paragraph, Blockquote, Code, Text, Content } from 'mdast';

// GitHub Primer Octicons for Callouts (Alerts)
const GITHUB_OCTICONS: Record<string, string> = {
  note: `<svg class="callout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`,
  tip: `<svg class="callout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/></svg>`,
  important: `<svg class="callout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`,
  warning: `<svg class="callout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`,
  caution: `<svg class="callout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`,
};

const FOLD_CHEVRON_SVG = `<svg class="callout-fold-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

function normalizeCalloutType(raw: string): { type: string; defaultTitle: string } {
  switch (raw) {
    case 'tip':
    case 'hint':
    case 'success':
    case 'check':
    case 'done':
      return { type: 'tip', defaultTitle: 'Tip' };
    case 'important':
      return { type: 'important', defaultTitle: 'Important' };
    case 'warning':
    case 'warn':
    case 'attention':
      return { type: 'warning', defaultTitle: 'Warning' };
    case 'caution':
    case 'danger':
    case 'error':
    case 'bug':
    case 'failure':
    case 'fail':
    case 'missing':
      return { type: 'caution', defaultTitle: 'Caution' };
    case 'note':
    case 'info':
    default:
      return { type: 'note', defaultTitle: 'Note' };
  }
}

export function remarkObsidian() {
  return (tree: Root) => {
    // 1. Transform mermaid code blocks to <div class="mermaid-block"> with Diagram/Code toggle
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        const diagramCode = node.value;
        const escapedDiagram = diagramCode.replace(/"/g, '&quot;');
        const escapedHtml = diagramCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const mermaidContainer = {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: {
              className: 'mermaid-block group relative my-6 rounded-lg border border-border overflow-hidden',
              'data-diagram': diagramCode,
            },
          },
          children: [
            {
              type: 'html',
              value: `<div class="mermaid-header relative flex items-center justify-end gap-1.5 border-b border-border bg-muted/20 px-3 py-2 text-xs md:absolute md:top-2 md:right-2 md:z-10 md:border-b-0 md:bg-transparent md:p-0 md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-150 group-hover:md:opacity-100 group-hover:md:pointer-events-auto focus-within:md:opacity-100 focus-within:md:pointer-events-auto">
  <button type="button" class="mermaid-view-toggle-btn" aria-label="코드 보기" title="코드 보기">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  </button>
  <button type="button" class="mermaid-copy-btn" aria-label="코드 복사" title="코드 복사">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  </button>
</div>
<div class="mermaid-preview-panel flex justify-center p-4 md:pt-11 overflow-x-auto min-h-[100px] items-center">
  <div class="mermaid not-prose flex justify-center w-full overflow-x-auto py-2" data-diagram="${escapedDiagram}">${diagramCode}</div>
</div>
<div class="mermaid-code-panel hidden p-4 md:pt-11 overflow-x-auto font-mono text-sm">
  <pre class="font-mono text-sm !m-0 !p-0 !border-0 !bg-transparent text-foreground"><code>${escapedHtml}</code></pre>
</div>`,
            },
          ],
        };
        (parent.children as Content[])[index] = mermaidContainer as unknown as Content;
      }
    });

    // 2. Transform Obsidian image embeds (![[image.png|alt]]) and wikilinks ([[link|alias]])
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // Check if paragraph consists only of an image embed ![[file|alt]]
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const text = node.children[0].value.trim();
        const imgMatch = text.match(/^!\[\[([^|\]]+)(?:\|([^\]]+))?\]\]$/);
        if (imgMatch && parent && typeof index === 'number') {
          const file = imgMatch[1].trim();
          const altOrWidth = (imgMatch[2] || file).trim();
          const isDimension = /^\d+(x\d+)?$/.test(altOrWidth);
          const alt = isDimension ? file : altOrWidth;
          const url = file.startsWith('./') || file.startsWith('/') || file.startsWith('http')
            ? file
            : `./${file}`;

          (parent.children as Content[])[index] = {
            type: 'paragraph',
            children: [
              {
                type: 'image',
                url,
                alt,
              },
            ],
          } as unknown as Content;
          return;
        }
      }

      // Handle inline wikilinks: [[page|alias]] or [[page]]
      const newChildren: Content[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          const text = child.value;
          const wikiLinkRegex = /(?:(!)?\[\[([^|\]]+)(?:\|([^\]]+))?\]\])/g;
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = wikiLinkRegex.exec(text)) !== null) {
            const isEmbed = match[1] === '!';
            const target = match[2].trim();
            const alias = (match[3] || target).trim();
            const matchIndex = match.index;

            if (matchIndex > lastIndex) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex, matchIndex),
              } as Text);
            }

            if (isEmbed) {
              const url = target.startsWith('./') || target.startsWith('/') || target.startsWith('http')
                ? target
                : `./${target}`;
              newChildren.push({
                type: 'image',
                url,
                alt: alias,
              } as unknown as Content);
            } else {
              let href = target;
              if (target.startsWith('#')) {
                href = target.toLowerCase().replace(/\s+/g, '-');
              } else {
                const slug = target
                  .toLowerCase()
                  .replace(/^[./\\]+/, '')
                  .replace(/\.md$/, '')
                  .replace(/\s+/g, '-');
                href = `/blog/${slug}`;
              }

              newChildren.push({
                type: 'link',
                url: href,
                children: [{ type: 'text', value: alias }],
              } as unknown as Content);
            }

            lastIndex = wikiLinkRegex.lastIndex;
          }

          if (lastIndex < text.length) {
            newChildren.push({
              type: 'text',
              value: text.slice(lastIndex),
            } as Text);
          }
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren as typeof node.children;
    });

    // 3. Transform Obsidian Callouts (> [!type] Title)
    visit(tree, 'blockquote', (node: Blockquote) => {
      const firstChild = node.children[0];
      if (firstChild && firstChild.type === 'paragraph') {
        const firstText = firstChild.children[0];
        if (firstText && firstText.type === 'text') {
          const match = firstText.value.match(
            /^\s*\[!([a-zA-Z0-9_-]+)\]([+-]?)(?:[ \t]+([^\n]*))?(?:\n([\s\S]*))?$/
          );
          if (match) {
            const rawType = match[1].toLowerCase();
            const fold = match[2]; // '+' or '-'
            const customTitle = match[3]?.trim();
            const rest = match[4] ?? '';

            // Normalize type aliases
            const { type, defaultTitle } = normalizeCalloutType(rawType);
            const title = customTitle || defaultTitle;
            const escapedTitle = title
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            const iconSvg = GITHUB_OCTICONS[type] || GITHUB_OCTICONS.note;

            // Clean up the first text node
            if (rest.trim()) {
              firstText.value = rest;
            } else {
              firstChild.children.shift();
              if (firstChild.children.length === 0) {
                node.children.shift();
              }
            }

            const isFoldable = Boolean(fold);
            const isOpen = fold === '+';

            node.data = {
              hName: isFoldable ? 'details' : 'div',
              hProperties: {
                className: `callout callout-${type}`,
                'data-callout': type,
                ...(isFoldable ? { 'data-collapsible': 'true' } : {}),
                ...(isFoldable && isOpen ? { open: true } : {}),
              },
            };

            const titleNode = {
              type: 'paragraph',
              data: {
                hName: isFoldable ? 'summary' : 'div',
                hProperties: {
                  className: 'callout-title',
                },
              },
              children: [
                {
                  type: 'html',
                  value: `<span class="callout-title-icon">${iconSvg}</span><span class="callout-title-text">${escapedTitle}</span>${isFoldable ? `<span class="callout-fold-icon-wrapper">${FOLD_CHEVRON_SVG}</span>` : ''}`,
                },
              ],
            };

            node.children.unshift(titleNode as unknown as Paragraph);
          }
        }
      }
    });
  };
}
