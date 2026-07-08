import { useMemo, useState } from "react";
import { Button } from "./ui";

export interface ReportItem {
	id: string;
	title: string;
	summary: string;
	updatedAt: string;
	author?: string;
	tags?: string[];
	markdown: string;
}

interface ReportViewerProps {
	reports: ReportItem[];
}

interface LinkParts {
	label: string;
	href: string;
}

const INLINE_TOKEN_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g;

const REPORT_PLACEHOLDER = "No reports available yet. Generate a report to get started.";

const parseLink = (token: string): LinkParts | null => {
	const match = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);

	if (!match) {
		return null;
	}

	return {
		label: match[1],
		href: match[2],
	};
};

const renderInlineMarkdown = (text: string, prefix: string) => {
	const chunks = text.split(INLINE_TOKEN_PATTERN).filter(Boolean);

	return chunks.map((chunk, index) => {
		const key = `${prefix}-${index}`;

		if (chunk.startsWith("**") && chunk.endsWith("**")) {
			return <strong key={key}>{chunk.slice(2, -2)}</strong>;
		}

		if (chunk.startsWith("*") && chunk.endsWith("*")) {
			return <em key={key}>{chunk.slice(1, -1)}</em>;
		}

		if (chunk.startsWith("`") && chunk.endsWith("`")) {
			return <code key={key}>{chunk.slice(1, -1)}</code>;
		}

		if (chunk.startsWith("[") && chunk.includes("](")) {
			const link = parseLink(chunk);

			if (link) {
				return (
					<a key={key} href={link.href} rel="noreferrer" target="_blank">
						{link.label}
					</a>
				);
			}
		}

		return <span key={key}>{chunk}</span>;
	});
};

const markdownToPlainText = (markdown: string) =>
	markdown
		.replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ""))
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^>\s?/gm, "")
		.replace(/^[-*]\s+/gm, "- ")
		.replace(/^\d+\.\s+/gm, "")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1 ($2)")
		.trim();

const buildHtmlExport = (title: string, markdown: string) => {
	const escapedTitle = title
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

	const escapedBody = markdown
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>
      body {
        margin: 0;
        padding: 2rem;
        font-family: "Segoe UI", Tahoma, sans-serif;
        color: #13203c;
        background: #f7f9fe;
      }
      main {
        max-width: 880px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #d6deee;
        border-radius: 14px;
        padding: 1.25rem;
      }
      pre {
        white-space: pre-wrap;
        font-family: Consolas, "Courier New", monospace;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapedTitle}</h1>
      <pre>${escapedBody}</pre>
    </main>
  </body>
</html>`;
};

const renderMarkdownBlocks = (markdown: string) => {
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	const blocks: JSX.Element[] = [];
	let index = 0;

	const isBlockBoundary = (line: string) => {
		const trimmedLine = line.trim();
		return (
			trimmedLine.length === 0 ||
			/^#{1,6}\s+/.test(trimmedLine) ||
			/^```/.test(trimmedLine) ||
			/^>\s?/.test(trimmedLine) ||
			/^[-*]\s+/.test(trimmedLine) ||
			/^\d+\.\s+/.test(trimmedLine)
		);
	};

	while (index < lines.length) {
		const line = lines[index];
		const trimmedLine = line.trim();

		if (!trimmedLine) {
			index += 1;
			continue;
		}

		if (/^```/.test(trimmedLine)) {
			const language = trimmedLine.replace(/^```/, "").trim();
			const codeLines: string[] = [];
			index += 1;

			while (index < lines.length && !/^```/.test(lines[index].trim())) {
				codeLines.push(lines[index]);
				index += 1;
			}

			index += 1;

			blocks.push(
				<pre key={`code-${index}`} className="rv-code-block">
					{language ? <span className="rv-code-label">{language}</span> : null}
					<code>{codeLines.join("\n")}</code>
				</pre>,
			);

			continue;
		}

		const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);

		if (headingMatch) {
			const level = headingMatch[1].length;
			const text = headingMatch[2];
			const headingKey = `heading-${index}`;

			if (level === 1) {
				blocks.push(<h1 key={headingKey}>{renderInlineMarkdown(text, headingKey)}</h1>);
			} else if (level === 2) {
				blocks.push(<h2 key={headingKey}>{renderInlineMarkdown(text, headingKey)}</h2>);
			} else if (level === 3) {
				blocks.push(<h3 key={headingKey}>{renderInlineMarkdown(text, headingKey)}</h3>);
			} else {
				blocks.push(<h4 key={headingKey}>{renderInlineMarkdown(text, headingKey)}</h4>);
			}

			index += 1;
			continue;
		}

		if (/^>\s?/.test(trimmedLine)) {
			const quoteLines: string[] = [];

			while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
				quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
				index += 1;
			}

			const quoteText = quoteLines.join(" ");
			blocks.push(
				<blockquote key={`quote-${index}`}>
					{renderInlineMarkdown(quoteText, `quote-${index}`)}
				</blockquote>,
			);
			continue;
		}

		if (/^[-*]\s+/.test(trimmedLine)) {
			const items: string[] = [];

			while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
				items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
				index += 1;
			}

			blocks.push(
				<ul key={`ul-${index}`}>
					{items.map((item, itemIndex) => (
						<li key={`ul-${index}-${itemIndex}`}>
							{renderInlineMarkdown(item, `ul-${index}-${itemIndex}`)}
						</li>
					))}
				</ul>,
			);
			continue;
		}

		if (/^\d+\.\s+/.test(trimmedLine)) {
			const items: string[] = [];

			while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
				items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
				index += 1;
			}

			blocks.push(
				<ol key={`ol-${index}`}>
					{items.map((item, itemIndex) => (
						<li key={`ol-${index}-${itemIndex}`}>
							{renderInlineMarkdown(item, `ol-${index}-${itemIndex}`)}
						</li>
					))}
				</ol>,
			);
			continue;
		}

		const paragraphLines = [trimmedLine];
		index += 1;

		while (index < lines.length && !isBlockBoundary(lines[index])) {
			paragraphLines.push(lines[index].trim());
			index += 1;
		}

		const paragraphText = paragraphLines.join(" ");
		blocks.push(
			<p key={`p-${index}`}>{renderInlineMarkdown(paragraphText, `p-${index}`)}</p>,
		);
	}

	return blocks;
};

const ReportViewer = ({ reports }: ReportViewerProps) => {
	const [selectedReportId, setSelectedReportId] = useState<string>(
		reports[0]?.id ?? "",
	);

	const selectedReport = useMemo(
		() => reports.find((report) => report.id === selectedReportId) ?? reports[0],
		[reports, selectedReportId],
	);

	const renderedMarkdown = useMemo(
		() => (selectedReport ? renderMarkdownBlocks(selectedReport.markdown) : []),
		[selectedReport],
	);

	const handleDownload = (format: "markdown" | "text" | "html") => {
		if (!selectedReport) {
			return;
		}

		let content = selectedReport.markdown;
		let extension = "md";
		let mimeType = "text/markdown;charset=utf-8";

		if (format === "text") {
			content = markdownToPlainText(selectedReport.markdown);
			extension = "txt";
			mimeType = "text/plain;charset=utf-8";
		} else if (format === "html") {
			content = buildHtmlExport(selectedReport.title, selectedReport.markdown);
			extension = "html";
			mimeType = "text/html;charset=utf-8";
		}

		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");

		anchor.href = url;
		anchor.download = `${selectedReport.id}.${extension}`;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};

	if (!reports.length) {
		return (
			<section className="panel report-viewer report-viewer-empty" aria-live="polite">
				<p>{REPORT_PLACEHOLDER}</p>
			</section>
		);
	}

	return (
		<section className="report-viewer" aria-label="Report viewer">
			<aside className="panel rv-list" aria-label="Report list">
				<h3>Generated Reports</h3>
				<div className="rv-list-items">
					{reports.map((report) => {
						const isSelected = report.id === selectedReport?.id;

						return (
							<button
								aria-pressed={isSelected}
								className={`rv-list-item ${
									isSelected ? "rv-list-item-active" : ""
								}`}
								onClick={() => setSelectedReportId(report.id)}
								key={report.id}
								type="button"
							>
								<span className="rv-list-title">{report.title}</span>
								<span className="rv-list-summary">{report.summary}</span>
								<span className="rv-list-date">Updated {report.updatedAt}</span>
							</button>
						);
					})}
				</div>
			</aside>

			<article className="panel rv-content" aria-label="Selected report">
				<header className="rv-content-header">
					<div>
						<h3>{selectedReport?.title}</h3>
						<p>{selectedReport?.summary}</p>
						<div className="rv-meta-row">
							<span>Updated {selectedReport?.updatedAt}</span>
							{selectedReport?.author ? (
								<span>Author {selectedReport.author}</span>
							) : null}
						</div>
						{selectedReport?.tags?.length ? (
							<div className="rv-tags">
								{selectedReport.tags.map((tag) => (
									<span key={tag} className="rv-tag">
										{tag}
									</span>
								))}
							</div>
						) : null}
					</div>

					<div className="rv-actions" aria-label="Download options">
						<Button onClick={() => handleDownload("markdown")} size="sm" variant="secondary">
							Download MD
						</Button>
						<Button onClick={() => handleDownload("text")} size="sm" variant="secondary">
							Download TXT
						</Button>
						<Button onClick={() => handleDownload("html")} size="sm" variant="primary">
							Download HTML
						</Button>
					</div>
				</header>

				<div className="rv-markdown" aria-label="Rendered markdown report">
					{renderedMarkdown}
				</div>
			</article>
		</section>
	);
};

export default ReportViewer;
