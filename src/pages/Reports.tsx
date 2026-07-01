const reports = [
	{
		title: "Weekly Agent Performance",
		details: "PDF . Updated today",
	},
	{
		title: "Usage Cost Breakdown",
		details: "CSV . Updated yesterday",
	},
	{
		title: "Security Scan Summary",
		details: "PDF . Updated 2 days ago",
	},
];

const Reports = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>Reports</h2>
				<p>Access generated documents and analytics exports.</p>
			</header>

			<div className="panel-stack">
				{reports.map((report) => (
					<article className="panel report-item" key={report.title}>
						<div>
							<h3>{report.title}</h3>
							<p>{report.details}</p>
						</div>
						<button type="button">View</button>
					</article>
				))}
			</div>
		</section>
	);
};

export default Reports;
