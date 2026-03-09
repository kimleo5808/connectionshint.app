function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInlineMarkdown(text: string) {
  return escapeHtml(text)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="text-indigo-600 underline underline-offset-4 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" href="$2">$1</a>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-indigo-50 px-2 py-1 font-mono text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">$1</code>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function isSpecialBlockStart(line: string) {
  return (
    /^#{1,6}\s/.test(line) ||
    /^>\s?/.test(line) ||
    /^-\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^---+$/.test(line)
  );
}

function renderMarkdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index].trimEnd();

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      html.push('<hr class="my-8 border-t border-indigo-200 dark:border-indigo-800" />');
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = renderInlineMarkdown(headingMatch[2].trim());
      const headingClasses = {
        1: "mt-8 mb-6 font-heading text-4xl font-bold",
        2: "mt-8 mb-6 border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-semibold",
        3: "mt-6 mb-4 font-heading text-xl font-semibold text-indigo-700 dark:text-indigo-300",
        4: "mt-6 mb-4 font-heading text-lg font-semibold",
        5: "mt-6 mb-4 font-heading text-base font-semibold",
        6: "mt-6 mb-4 font-heading text-sm font-semibold",
      } as const;
      html.push(
        `<h${level} class="${headingClasses[level as keyof typeof headingClasses]}">${content}</h${level}>`
      );
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, "").trim());
        index += 1;
      }
      html.push(
        `<blockquote class="my-6 border-l-4 border-indigo-300 pl-6 italic text-slate-600 dark:border-indigo-700 dark:text-slate-400">${renderInlineMarkdown(
          quoteLines.join(" ")
        )}</blockquote>`
      );
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^-\s+/, "").trim());
        index += 1;
      }
      html.push(
        `<ul class="mb-6 mt-0 list-disc pl-6">${items
          .map(
            (item) =>
              `<li class="mb-3 text-slate-700 dark:text-slate-300">${renderInlineMarkdown(item)}</li>`
          )
          .join("")}</ul>`
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, "").trim());
        index += 1;
      }
      html.push(
        `<ol class="mb-6 mt-0 list-decimal pl-6">${items
          .map(
            (item) =>
              `<li class="mb-3 text-slate-700 dark:text-slate-300">${renderInlineMarkdown(item)}</li>`
          )
          .join("")}</ol>`
      );
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index].trimEnd();
      if (!nextLine.trim() || isSpecialBlockStart(nextLine)) {
        break;
      }
      paragraphLines.push(nextLine.trim());
      index += 1;
    }

    html.push(
      `<p class="my-6 leading-relaxed text-slate-700 dark:text-slate-300">${renderInlineMarkdown(
        paragraphLines.join(" ")
      )}</p>`
    );
  }

  return html.join("");
}

export default function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(markdown) }}
    />
  );
}
