const API_BASE = "/api";

const DEV_LATENCY_MS = {
	submit: 1400,
	list: 600,
	report: 700,
};

const devRequestResponses = new Map();

const DEV_REPORTS = [
	{
		id: "weekly-agent-performance",
		title: "Weekly Agent Performance",
		summary: "Summary of throughput, latency, and quality trends over 7 days.",
		updatedAt: "today",
		author: "Operations Team",
		tags: ["performance", "weekly", "operations"],
		markdown:
			"# Weekly Agent Performance\n\n## Overview\nThe platform processed **42,310 requests** this week across research, retrieval, and summarization workflows.\n\n> Throughput is up 12% week-over-week while quality stayed stable.\n\n## Key Metrics\n- Success rate: **98.7%**\n- Median latency: **1.21s**\n- P95 latency: **2.84s**\n- Error budget consumed: **31%**\n\n## Action Items\n1. Expand autoscaling threshold for ingestion agents.\n2. Tune queue prefetch for heavy document batches.\n3. Audit logs for external API saturation windows.",
	},
	{
		id: "usage-cost-breakdown",
		title: "Usage Cost Breakdown",
		summary: "Token and compute spending by team and workload category.",
		updatedAt: "yesterday",
		author: "FinOps",
		tags: ["cost", "finance", "capacity"],
		markdown:
			"# Usage Cost Breakdown\n\n## Monthly Spend\nTotal platform spend reached **$18,420** with the following split:\n\n- Model inference: **$11,220**\n- Vector retrieval: **$3,470**\n- Data processing: **$2,610**\n- Storage + misc: **$1,120**\n\n## Optimization Recommendations\n- Move low-priority nightly jobs to the batch profile.\n- Reduce max token ceiling from 8k to 6k for triage prompts.",
	},
];

async function readErrorMessage(response) {
	const fallback = `Request failed (${response.status})`;

	try {
		const data = await response.json();
		if (typeof data?.message === "string" && data.message.trim()) {
			return data.message;
		}
	} catch {
		// Ignore JSON parsing issues and try plain text next.
	}

	try {
		const text = await response.text();
		if (text.trim()) return text;
	} catch {
		// Ignore text parsing issues and use fallback.
	}

	return fallback;
}

/**
 * Submit a new research request.
 * @param {object} payload
 * @param {string} payload.topic
 * @param {string} payload.description
 * @param {string} payload.researchType
 * @param {string} payload.priority
 * @param {string} [payload.deadline]
 * @param {string[]} [payload.tags]
 * @param {boolean} [payload.notifyOnComplete]
 * @returns {Promise<{ id: string }>}
 */
export async function submitResearchRequest(payload) {
	// Simulate a network request in development when no real backend exists.
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, DEV_LATENCY_MS.submit));
		const id = `RR-${Date.now()}`;
		const normalizedTags = Array.isArray(payload.tags) ? payload.tags : [];
		const aiResponse = {
			id,
			title: `AI Research Brief: ${payload.topic}`,
			summary: "Generated initial findings and recommended next actions.",
			updatedAt: "just now",
			author: "AI Research Agent",
			tags: normalizedTags,
			markdown: `# AI Research Brief\n\n## Topic\n${payload.topic}\n\n## Objective\n${payload.description}\n\n## Key Findings\n- Current trend indicates growing adoption in enterprise workflows.\n- Competitive landscape is led by providers with strong integration ecosystems.\n- Primary risk is evaluation drift without domain-specific benchmarks.\n\n## Recommended Next Steps\n1. Define measurable success metrics for the pilot.\n2. Run a small benchmark against baseline solutions.\n3. Document cost and latency thresholds for production readiness.`,
		};

		devRequestResponses.set(id, aiResponse);
		return { id, aiResponse };
	}

	const response = await fetch(`${API_BASE}/research-requests`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const message = await readErrorMessage(response);
		throw new Error(message);
	}

	return response.json();
}

/**
 * Fetch AI response output for a research request.
 * @param {string} requestId
 * @returns {Promise<object>}
 */
export async function getResearchRequestResponse(requestId) {
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, DEV_LATENCY_MS.report));
		const response = devRequestResponses.get(requestId);

		if (!response) {
			throw new Error("AI response not found for this request ID.");
		}

		return response;
	}

	const response = await fetch(
		`${API_BASE}/research-requests/${encodeURIComponent(requestId)}/response`
	);

	if (!response.ok) {
		const message = await readErrorMessage(response);
		throw new Error(message);
	}

	return response.json();
}

/**
 * Fetch all research requests.
 * @returns {Promise<object[]>}
 */
export async function getResearchRequests() {
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, DEV_LATENCY_MS.list));
		return Array.from(devRequestResponses.values()).map((item) => ({
			id: item.id,
			topic: item.title,
			status: "completed",
		}));
	}

	const response = await fetch(`${API_BASE}/research-requests`);
	if (!response.ok) {
		const message = await readErrorMessage(response);
		throw new Error(message);
	}

	return response.json();
}

/**
 * Fetch generated reports.
 * @returns {Promise<object[]>}
 */
export async function getReports() {
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, DEV_LATENCY_MS.list));
		return [
			...Array.from(devRequestResponses.values()).reverse(),
			...DEV_REPORTS,
		];
	}

	const response = await fetch(`${API_BASE}/reports`);
	if (!response.ok) {
		const message = await readErrorMessage(response);
		throw new Error(message);
	}

	const data = await response.json();
	return Array.isArray(data) ? data : data?.reports ?? [];
}
