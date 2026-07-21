import type { ReportItem } from "../components/ReportViewer";

export const normalizeReport = (
	item: Record<string, unknown>,
	index: number,
): ReportItem => {
	const markdown =
		typeof item.markdown === "string"
			? item.markdown
			: typeof item.content === "string"
			? item.content
			: typeof item.response === "string"
			? item.response
			: "";

	return {
		id:
			typeof item.id === "string" && item.id.trim()
				? item.id
				: `report-${index + 1}`,
		title:
			typeof item.title === "string" && item.title.trim()
				? item.title
				: "Untitled Report",
		summary:
			typeof item.summary === "string" && item.summary.trim()
				? item.summary
				: "No summary available.",
		updatedAt:
			typeof item.updatedAt === "string" && item.updatedAt.trim()
				? item.updatedAt
				: "recently",
		author: typeof item.author === "string" ? item.author : undefined,
		tags: Array.isArray(item.tags)
			? item.tags.filter((tag): tag is string => typeof tag === "string")
			: undefined,
		markdown: markdown || "No AI response content available.",
	};
};