type AgentState = "running" | "queued" | "blocked" | "completed";

type AgentItem = {
	id: string;
	name: string;
	role: string;
	state: AgentState;
	utilization: number;
	throughput: string;
	eta: string;
};

type WorkflowStep = {
	id: string;
	name: string;
	progress: number;
	state: AgentState;
};

const agents: AgentItem[] = [
	{
		id: "planner-01",
		name: "Planner Agent",
		role: "Task decomposition",
		state: "running",
		utilization: 86,
		throughput: "58 tasks/hr",
		eta: "2 min",
	},
	{
		id: "research-02",
		name: "Research Agent",
		role: "Source retrieval",
		state: "queued",
		utilization: 34,
		throughput: "41 docs/hr",
		eta: "5 min",
	},
	{
		id: "executor-04",
		name: "Execution Agent",
		role: "Pipeline execution",
		state: "blocked",
		utilization: 61,
		throughput: "29 jobs/hr",
		eta: "waiting",
	},
	{
		id: "validator-03",
		name: "Validation Agent",
		role: "Quality checks",
		state: "completed",
		utilization: 100,
		throughput: "73 checks/hr",
		eta: "done",
	},
];

const workflow: WorkflowStep[] = [
	{ id: "wf-1", name: "Intake", progress: 100, state: "completed" },
	{ id: "wf-2", name: "Planning", progress: 82, state: "running" },
	{ id: "wf-3", name: "Execution", progress: 46, state: "queued" },
	{ id: "wf-4", name: "Validation", progress: 23, state: "blocked" },
	{ id: "wf-5", name: "Delivery", progress: 8, state: "queued" },
];

const executionSummary = [
	{ state: "running", label: "Running", value: 14, colorClass: "is-running" },
	{ state: "queued", label: "Queued", value: 9, colorClass: "is-queued" },
	{ state: "blocked", label: "Blocked", value: 2, colorClass: "is-blocked" },
	{
		state: "completed",
		label: "Completed",
		value: 67,
		colorClass: "is-completed",
	},
];

const getStateLabel = (state: AgentState) => {
	switch (state) {
		case "running":
			return "Running";
		case "queued":
			return "Queued";
		case "blocked":
			return "Blocked";
		case "completed":
			return "Completed";
	}
};

const getStateClassName = (state: AgentState) => {
	switch (state) {
		case "running":
			return "is-running";
		case "queued":
			return "is-queued";
		case "blocked":
			return "is-blocked";
		case "completed":
			return "is-completed";
	}
};

const overallProgress = Math.round(
	workflow.reduce((acc, step) => acc + step.progress, 0) / workflow.length,
);

const AgentStatus = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>Agent Status</h2>
				<p>
					Track workflow progress, execution states, and per-agent performance in
					one view.
				</p>
			</header>

			<div className="status-kpis">
				<article className="metric-card status-kpi">
					<p>Workflow Completion</p>
					<h3>{overallProgress}%</h3>
					<div className="progress-track" aria-hidden="true">
						<span style={{ width: `${overallProgress}%` }} />
					</div>
				</article>
				<article className="metric-card status-kpi">
					<p>Agents Online</p>
					<h3>{agents.length}</h3>
					<small>4 healthy worker pools</small>
				</article>
				<article className="metric-card status-kpi">
					<p>Execution Velocity</p>
					<h3>132 jobs/hr</h3>
					<small>+7.4% vs previous hour</small>
				</article>
			</div>

			<div className="content-grid status-content-grid">
				<article className="panel workflow-panel">
					<div className="status-panel-header">
						<h3>Workflow Progress</h3>
						<span>{overallProgress}% complete</span>
					</div>
					<ul className="workflow-steps">
						{workflow.map((step) => (
							<li key={step.id}>
								<div>
									<strong>{step.name}</strong>
									<span
										className={`state-pill ${getStateClassName(step.state)}`}
									>
										{getStateLabel(step.state)}
									</span>
								</div>
								<div className="progress-track" aria-hidden="true">
									<span style={{ width: `${step.progress}%` }} />
								</div>
								<em>{step.progress}%</em>
							</li>
						))}
					</ul>
				</article>

				<article className="panel">
					<div className="status-panel-header">
						<h3>Execution States</h3>
						<span>Live distribution</span>
					</div>
					<ul className="execution-state-list">
						{executionSummary.map((item) => (
							<li key={item.state}>
								<div>
									<strong>{item.label}</strong>
									<span>{item.value} tasks</span>
								</div>
								<div className="progress-track" aria-hidden="true">
									<span
										className={item.colorClass}
										style={{ width: `${item.value}%` }}
									/>
								</div>
							</li>
						))}
					</ul>
				</article>
			</div>

			<article className="panel">
				<div className="status-panel-header">
					<h3>Agent Performance Grid</h3>
					<span>Updated every 15 seconds</span>
				</div>
				<div className="agent-grid">
					{agents.map((agent) => (
						<article className="agent-card" key={agent.id}>
							<div className="agent-card-head">
								<div>
									<h4>{agent.name}</h4>
									<p>{agent.role}</p>
								</div>
								<span className={`state-pill ${getStateClassName(agent.state)}`}>
									{getStateLabel(agent.state)}
								</span>
							</div>
							<div className="agent-card-body">
								<div>
									<span>Utilization</span>
									<strong>{agent.utilization}%</strong>
								</div>
								<div className="progress-track" aria-hidden="true">
									<span style={{ width: `${agent.utilization}%` }} />
								</div>
								<div className="agent-meta">
									<small>{agent.throughput}</small>
									<small>ETA: {agent.eta}</small>
								</div>
							</div>
						</article>
					))}
				</div>
			</article>
		</section>
	);
};

export default AgentStatus;
