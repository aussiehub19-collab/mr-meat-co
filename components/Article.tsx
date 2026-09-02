import React from 'react';
import Link from 'next/link';

/**
 * Minimal, dependency-free Markdown renderer for blog post `content`.
 * Supports: # ## ### headings, **bold**, *italic*, [text](url) links,
 * `- ` / `* ` unordered lists, `1. ` ordered lists, `> ` blockquotes,
 * `---` horizontal rules, and blank-line-separated paragraphs.
 */

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={`${keyBase}-b-${i}`} className="text-white font-bold">{m[2]}</strong>);
    else if (m[3]) nodes.push(<em key={`${keyBase}-i-${i}`}>{m[4]}</em>);
    else if (m[5]) {
      const href = m[7];
      const internal = href.startsWith('/');
      nodes.push(
        internal ? (
          <Link key={`${keyBase}-l-${i}`} href={href} className="text-red-400 font-semibold underline underline-offset-2 hover:text-red-300">{m[6]}</Link>
        ) : (
          <a key={`${keyBase}-l-${i}`} href={href} target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold underline underline-offset-2 hover:text-red-300">{m[6]}</a>
        )
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Article({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    if (trimmed === '---') { blocks.push(<hr key={key++} className="border-[#991B1B]/30 my-8" />); i++; continue; }

    const h = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const cls =
        level === 1 ? 'text-2xl sm:text-3xl font-black text-white font-serif mt-10 mb-3'
        : level === 2 ? 'text-xl sm:text-2xl font-black text-white font-serif mt-9 mb-3'
        : 'text-lg font-bold text-red-300 mt-7 mb-2';
      const Tag = (level === 1 ? 'h2' : level === 2 ? 'h2' : 'h3') as keyof React.JSX.IntrinsicElements;
      blocks.push(<Tag key={key++} className={cls}>{renderInline(h[2], `h${key}`)}</Tag>);
      i++;
      continue;
    }

    // table: | a | b | \n | --- | --- | \n | ... |
    if (/^\|.*\|$/.test(trimmed) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(trimmed);
      i += 2;
      const body: string[][] = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) { body.push(cells(lines[i].trim())); i++; }
      blocks.push(
        <div key={key++} className="my-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{head.map((h, x) => <th key={x} className="text-left font-bold text-white border-b border-[#991B1B]/40 py-2 pr-4">{renderInline(h, `th${key}-${x}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, y) => (
                <tr key={y}>{r.map((c, x) => <td key={x} className="border-b border-[#991B1B]/15 py-2 pr-4 text-gray-200 align-top">{renderInline(c, `td${key}-${y}-${x}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) { buf.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      blocks.push(
        <blockquote key={key++} className="border-l-4 border-red-600 bg-[#1C1414] pl-4 py-2 my-4 text-gray-300 italic">
          {renderInline(buf.join(' '), `q${key}`)}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*]\s+/, '')); i++; }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 space-y-1.5 my-4 text-gray-200">
          {items.map((it, x) => <li key={x}>{renderInline(it, `ul${key}-${x}`)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s+/, '')); i++; }
      blocks.push(
        <ol key={key++} className="list-decimal pl-6 space-y-1.5 my-4 text-gray-200">
          {items.map((it, x) => <li key={x}>{renderInline(it, `ol${key}-${x}`)}</li>)}
        </ol>
      );
      continue;
    }

    // paragraph — gather until blank line
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|[-*]\s|\d+\.\s|>\s?|---$|\|)/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push(<p key={key++} className="my-4 leading-relaxed">{renderInline(buf.join(' '), `p${key}`)}</p>);
  }

  return <div className="text-gray-200 text-sm sm:text-base">{blocks}</div>;
}
