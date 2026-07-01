const metrics = [
	{ title: "Active Agents", value: "24" },
	{ title: "In Queue", value: "13" },
	{ title: "Success Rate", value: "98.5%" },
	{ title: "Alerts", value: "2" },
];

const Dashboard = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>Dashboard</h2>
				<p>Monitor AI workflows, throughput, and health in one place.</p>
			</header>

			<div className="metrics-grid">
				{metrics.map((metric) => (
					<article className="metric-card" key={metric.title}>
						<p>{metric.title}</p>
						<h3>{metric.value}</h3>
					</article>
				))}
			</div>

			<div className="content-grid">
				<article className="panel">
					<h3>Agent Health</h3>
					<p>
						Most agents are healthy. One ingestion worker is close to resource
						limit and may need autoscaling.
					</p>
				</article>

				<article className="panel">
					<h3>Recent Activity</h3>
					<ul>
						<li>Knowledge index refresh completed in 01:22.</li>
						<li>Batch sentiment analysis finished for 8,400 rows.</li>
						<li>Response quality score improved by 3.1% this week.</li>
					</ul>
				</article>
			</div>
		</section>
	);
};

export default Dashboard;
