const historyItems = [
	{ id: "HIS-1042", event: "Agent retraining finished", time: "4 min ago" },
	{ id: "HIS-1041", event: "Report generated", time: "12 min ago" },
	{ id: "HIS-1040", event: "Workflow started", time: "19 min ago" },
	{ id: "HIS-1039", event: "Anomaly alert sent", time: "35 min ago" },
];

const History = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>History</h2>
				<p>Review recent events and workflow execution activity.</p>
			</header>

			<article className="panel">
				<ul className="timeline">
					{historyItems.map((item) => (
						<li key={item.id}>
							<strong>{item.id}</strong>
							<span>{item.event}</span>
							<em>{item.time}</em>
						</li>
					))}
				</ul>
			</article>
		</section>
	);
};

export default History;
