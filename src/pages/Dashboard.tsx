import { Link } from "react-router-dom";

const metrics = [
	{ title: "Active Agents", value: "24" },
	{ title: "In Queue", value: "13" },
	{ title: "Success Rate", value: "98.5%" },
	{ title: "Alerts", value: "2" },
];

const workflowProgress = [
	{ name: "Ingestion", value: 100, state: "Complete" },
	{ name: "Planning", value: 84, state: "Running" },
	{ name: "Execution", value: 63, state: "Running" },
	{ name: "Validation", value: 41, state: "Queued" },
	{ name: "Delivery", value: 12, state: "Queued" },
];

const executionStates = [
	{ label: "Running", value: 14, className: "is-running" },
	{ label: "Queued", value: 9, className: "is-queued" },
	{ label: "Blocked", value: 2, className: "is-blocked" },
	{ label: "Completed", value: 67, className: "is-completed" },
];

const Dashboard = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>Dashboard</h2>
				<p>
					Monitor AI workflows, throughput, and health in one place with live
					progress indicators.
				</p>
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
					<div className="status-panel-header">
						<h3>Workflow Progress Snapshot</h3>
						<Link className="status-link" to="/agent-status">
							Open Agent Status
						</Link>
					</div>
					<ul className="workflow-steps">
						{workflowProgress.map((step) => (
							<li key={step.name}>
								<div>
									<strong>{step.name}</strong>
									<span>{step.state}</span>
								</div>
								<div className="progress-track" aria-hidden="true">
									<span style={{ width: `${step.value}%` }} />
								</div>
								<em>{step.value}%</em>
							</li>
						))}
					</ul>
				</article>

				<article className="panel">
					<h3>Agent Health</h3>
					<p>
						Most agents are healthy. One ingestion worker is close to resource
						limit and may need autoscaling.
					</p>
					<div className="execution-pills">
						{executionStates.map((item) => (
							<span className={`state-pill ${item.className}`} key={item.label}>
								{item.label}: {item.value}
							</span>
						))}
					</div>
				</article>

				<article className="panel">
					<h3>Recent Activity</h3>
					<ul>
						<li>Knowledge index refresh completed in 01:22.</li>
						<li>Batch sentiment analysis finished for 8,400 rows.</li>
						<li>Response quality score improved by 3.1% this week.</li>
					</ul>
					<div className="dashboard-state-bars">
						{executionStates.map((item) => (
							<div className="dashboard-state-row" key={item.label}>
								<div>
									<strong>{item.label}</strong>
									<span>{item.value}%</span>
								</div>
								<div className="progress-track" aria-hidden="true">
									<span
										className={item.className}
										style={{ width: `${item.value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</article>
			</div>
		</section>
	);
};

export default Dashboard;
