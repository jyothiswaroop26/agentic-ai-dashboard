import { useCallback, useEffect, useState } from "react";
import ReportViewer, { type ReportItem } from "../components/ReportViewer";
import { getReports } from "../services/api";
import { Link } from "react-router-dom";

const normalizeReport = (item: Record<string, unknown>, index: number): ReportItem => {
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

const Reports = () => {
	const [reports, setReports] = useState<ReportItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const loadReports = useCallback(async () => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const result = await getReports();
			const normalized = Array.isArray(result)
				? result.map((report, index) =>
						normalizeReport(report as Record<string, unknown>, index),
				  )
				: [];
			setReports(normalized);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Unable to load reports right now.",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadReports();
	}, [loadReports]);

	return (
		<section className="page">
			<header className="page-header reports-page-header">
				<div>
					<h2>Reports</h2>
					<p>
						Browse generated reports, read markdown output, and download in multiple
						formats.
					</p>
				</div>
				<Link className="status-link" to="/reports/history">
					View Reports History
				</Link>
			</header>

			{isLoading ? (
				<section className="panel reports-feedback" aria-live="polite">
					<span className="ui-btn-spinner" aria-hidden="true" />
					<p>Loading AI reports...</p>
				</section>
			) : errorMessage ? (
				<section className="panel reports-feedback reports-feedback-error" role="alert">
					<p>Failed to load reports: {errorMessage}</p>
					<button
						className="rr-btn rr-btn--ghost"
						onClick={() => void loadReports()}
						type="button"
					>
						Try Again
					</button>
				</section>
			) : (
				<ReportViewer reports={reports} />
			)}
		</section>
	);
};

export default Reports;
