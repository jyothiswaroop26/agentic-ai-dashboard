import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "../components/ui";

type ReportRun = {
	id: string;
	reportName: string;
	reportType: "Performance" | "Cost" | "Security" | "Operations";
	status: "Completed" | "Running" | "Failed";
	generatedAt: string;
	generatedBy: string;
	duration: string;
};

const reportHistoryData: ReportRun[] = [
	{
		id: "RR-3101",
		reportName: "Weekly Agent Performance",
		reportType: "Performance",
		status: "Completed",
		generatedAt: "2026-07-14 09:14",
		generatedBy: "Operations Team",
		duration: "01:42",
	},
	{
		id: "RR-3100",
		reportName: "Usage Cost Breakdown",
		reportType: "Cost",
		status: "Completed",
		generatedAt: "2026-07-14 07:02",
		generatedBy: "FinOps",
		duration: "02:11",
	},
	{
		id: "RR-3099",
		reportName: "Security Scan Summary",
		reportType: "Security",
		status: "Completed",
		generatedAt: "2026-07-13 22:41",
		generatedBy: "Security Team",
		duration: "03:26",
	},
	{
		id: "RR-3098",
		reportName: "Incident Postmortem Snapshot",
		reportType: "Operations",
		status: "Failed",
		generatedAt: "2026-07-13 20:18",
		generatedBy: "SRE",
		duration: "00:38",
	},
	{
		id: "RR-3097",
		reportName: "Monthly Capacity Outlook",
		reportType: "Operations",
		status: "Completed",
		generatedAt: "2026-07-13 18:54",
		generatedBy: "Platform Team",
		duration: "02:47",
	},
	{
		id: "RR-3096",
		reportName: "Prompt Efficiency Audit",
		reportType: "Performance",
		status: "Running",
		generatedAt: "2026-07-13 16:26",
		generatedBy: "Prompt Engineering",
		duration: "--:--",
	},
	{
		id: "RR-3095",
		reportName: "Token Consumption Drift",
		reportType: "Cost",
		status: "Completed",
		generatedAt: "2026-07-13 15:01",
		generatedBy: "FinOps",
		duration: "01:26",
	},
	{
		id: "RR-3094",
		reportName: "Latency by Model Tier",
		reportType: "Performance",
		status: "Completed",
		generatedAt: "2026-07-13 13:12",
		generatedBy: "Operations Team",
		duration: "01:54",
	},
	{
		id: "RR-3093",
		reportName: "Vulnerability Delta",
		reportType: "Security",
		status: "Running",
		generatedAt: "2026-07-13 11:39",
		generatedBy: "Security Team",
		duration: "--:--",
	},
	{
		id: "RR-3092",
		reportName: "Policy Compliance Summary",
		reportType: "Security",
		status: "Completed",
		generatedAt: "2026-07-13 10:17",
		generatedBy: "Risk Office",
		duration: "02:33",
	},
	{
		id: "RR-3091",
		reportName: "Workflow Throughput Hourly",
		reportType: "Performance",
		status: "Completed",
		generatedAt: "2026-07-12 22:08",
		generatedBy: "Operations Team",
		duration: "01:09",
	},
	{
		id: "RR-3090",
		reportName: "SLA Breach Risk Forecast",
		reportType: "Operations",
		status: "Failed",
		generatedAt: "2026-07-12 19:50",
		generatedBy: "SRE",
		duration: "00:52",
	},
];

const PAGE_SIZE = 6;

const ReportsHistory = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"All" | ReportRun["reportType"]>("All");
	const [statusFilter, setStatusFilter] = useState<"All" | ReportRun["status"]>("All");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredRows = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return reportHistoryData.filter((row) => {
			const matchesSearch =
				normalizedQuery.length === 0 ||
				row.id.toLowerCase().includes(normalizedQuery) ||
				row.reportName.toLowerCase().includes(normalizedQuery) ||
				row.generatedBy.toLowerCase().includes(normalizedQuery);

			const matchesType = typeFilter === "All" || row.reportType === typeFilter;
			const matchesStatus = statusFilter === "All" || row.status === statusFilter;

			return matchesSearch && matchesType && matchesStatus;
		});
	}, [searchQuery, typeFilter, statusFilter]);

	const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
	const safeCurrentPage = Math.min(currentPage, pageCount);

	const paginatedRows = useMemo(() => {
		const start = (safeCurrentPage - 1) * PAGE_SIZE;
		return filteredRows.slice(start, start + PAGE_SIZE);
	}, [filteredRows, safeCurrentPage]);

	const pageStart = filteredRows.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
	const pageEnd = Math.min(filteredRows.length, safeCurrentPage * PAGE_SIZE);

	const resetFilters = () => {
		setSearchQuery("");
		setTypeFilter("All");
		setStatusFilter("All");
		setCurrentPage(1);
	};

	const onSearchChange = (value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	const onTypeChange = (value: "All" | ReportRun["reportType"]) => {
		setTypeFilter(value);
		setCurrentPage(1);
	};

	const onStatusChange = (value: "All" | ReportRun["status"]) => {
		setStatusFilter(value);
		setCurrentPage(1);
	};

	return (
		<section className="page">
			<header className="page-header reports-history-header">
				<div>
					<h2>Reports History</h2>
					<p>Search, filter, and review past report generation runs.</p>
				</div>
				<Link className="status-link" to="/reports">
					Open Reports Library
				</Link>
			</header>

			<section className="panel reports-history-tools" aria-label="Report history filters">
				<div className="rh-search">
					<label className="rh-label" htmlFor="reports-history-search">
						Search
					</label>
					<input
						className="rh-input"
						id="reports-history-search"
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Search by ID, report name, or owner"
						value={searchQuery}
					/>
				</div>

				<div className="rh-filter">
					<label className="rh-label" htmlFor="reports-history-type">
						Type
					</label>
					<select
						className="rh-select"
						id="reports-history-type"
						onChange={(event) =>
							onTypeChange(event.target.value as "All" | ReportRun["reportType"])
						}
						value={typeFilter}
					>
						<option value="All">All types</option>
						<option value="Performance">Performance</option>
						<option value="Cost">Cost</option>
						<option value="Security">Security</option>
						<option value="Operations">Operations</option>
					</select>
				</div>

				<div className="rh-filter">
					<label className="rh-label" htmlFor="reports-history-status">
						Status
					</label>
					<select
						className="rh-select"
						id="reports-history-status"
						onChange={(event) =>
							onStatusChange(event.target.value as "All" | ReportRun["status"])
						}
						value={statusFilter}
					>
						<option value="All">All statuses</option>
						<option value="Completed">Completed</option>
						<option value="Running">Running</option>
						<option value="Failed">Failed</option>
					</select>
				</div>

				<div className="rh-actions">
					<Button onClick={resetFilters} size="sm" variant="secondary">
						Reset
					</Button>
				</div>
			</section>

			<section className="panel reports-history-table" aria-label="Report generation history table">
				<Table
					caption="Report generation runs"
					columns={[
						{ key: "id", label: "Run ID", width: "108px" },
						{ key: "reportName", label: "Report" },
						{ key: "reportType", label: "Type", width: "120px" },
						{
							key: "status",
							label: "Status",
							render: (value) => (
								<span
									className={`state-pill ${
										value === "Completed"
											? "is-completed"
											: value === "Running"
											? "is-running"
											: "is-blocked"
									}`}
								>
									{String(value)}
								</span>
							),
							width: "120px",
						},
						{ key: "generatedBy", label: "Generated By", width: "150px" },
						{ key: "generatedAt", label: "Generated At", width: "148px" },
						{ key: "duration", label: "Duration", width: "96px", align: "right" },
					]}
					emptyMessage="No report runs match your current search and filters."
					rowKey="id"
					rows={paginatedRows}
				/>

				<div className="rh-pagination" aria-label="Pagination controls">
					<p className="rh-pagination-summary">
						Showing {pageStart}-{pageEnd} of {filteredRows.length}
					</p>

					<div className="rh-pagination-controls">
						<Button
							disabled={safeCurrentPage === 1}
							onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
							size="sm"
							variant="secondary"
						>
							Previous
						</Button>

						{Array.from({ length: pageCount }, (_, index) => index + 1).map(
							(pageNumber) => (
								<button
									aria-current={safeCurrentPage === pageNumber ? "page" : undefined}
									className={`rh-page-btn ${
										safeCurrentPage === pageNumber ? "rh-page-btn-active" : ""
									}`}
									key={pageNumber}
									onClick={() => setCurrentPage(pageNumber)}
									type="button"
								>
									{pageNumber}
								</button>
							),
						)}

						<Button
							disabled={safeCurrentPage === pageCount}
							onClick={() =>
								setCurrentPage((previous) => Math.min(pageCount, previous + 1))
							}
							size="sm"
							variant="secondary"
						>
							Next
						</Button>
					</div>
				</div>
			</section>
		</section>
	);
};

export default ReportsHistory;