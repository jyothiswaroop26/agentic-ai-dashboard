import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReportViewer, { type ReportItem } from "../components/ReportViewer";
import { getReports } from "../services/api";
import { normalizeReport } from "../services/reportUtils";

const ReportDetails = () => {
	const { reportId = "" } = useParams();
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
					: "Unable to load report details right now.",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadReports();
	}, [loadReports]);

	const matchedReport = useMemo(
		() => reports.find((report) => report.id === reportId),
		[reports, reportId],
	);

	return (
		<section className="page">
			<header className="page-header reports-page-header report-details-header">
				<div>
					<h2>Report Details</h2>
					<p>
						Review full report content, copy sections, and export in your preferred
						format.
					</p>
				</div>
				<Link className="status-link" to="/reports">
					Back to Reports
				</Link>
			</header>

			{isLoading ? (
				<section className="panel reports-feedback" aria-live="polite">
					<span className="ui-btn-spinner" aria-hidden="true" />
					<p>Loading report details...</p>
				</section>
			) : errorMessage ? (
				<section className="panel reports-feedback reports-feedback-error" role="alert">
					<p>Failed to load report details: {errorMessage}</p>
				</section>
			) : reports.length === 0 ? (
				<section className="panel reports-feedback" aria-live="polite">
					<p>No reports available yet.</p>
				</section>
			) : !matchedReport ? (
				<section className="panel reports-feedback reports-feedback-error" role="alert">
					<p>Report not found for ID: {reportId}</p>
				</section>
			) : (
				<ReportViewer
					reports={reports}
					initialReportId={matchedReport.id}
					showDetailLinks={false}
				/>
			)}
		</section>
	);
};

export default ReportDetails;