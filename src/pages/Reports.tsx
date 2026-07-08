import ReportViewer, { type ReportItem } from "../components/ReportViewer";

const reports: ReportItem[] = [
	{
		id: "weekly-agent-performance",
		title: "Weekly Agent Performance",
		summary: "Summary of throughput, latency, and quality trends over 7 days.",
		updatedAt: "today",
		author: "Operations Team",
		tags: ["performance", "weekly", "operations"],
		markdown: `# Weekly Agent Performance\n\n## Overview\nThe platform processed **42,310 requests** this week across research, retrieval, and summarization workflows.\n\n> Throughput is up 12% week-over-week while quality stayed stable.\n\n## Key Metrics\n- Success rate: **98.7%**\n- Median latency: **1.21s**\n- P95 latency: **2.84s**\n- Error budget consumed: **31%**\n\n## Notable Events\n1. Prompt caching improved response time for long context sessions.\n2. Two retries spikes were observed during external API saturation.\n3. Agent fallback policy reduced failed completions by 18%.\n\n## Action Items\n- Expand autoscaling threshold for ingestion agents.\n- Tune queue prefetch for heavy document batches.\n- Audit logs at [Operations Board](https://example.com).\n\n\`\`\`bash\n# Current queue depth snapshot\nqueuectl stats --region us-east --service research\n\`\`\``,
	},
	{
		id: "usage-cost-breakdown",
		title: "Usage Cost Breakdown",
		summary: "Token and compute spending by team and workload category.",
		updatedAt: "yesterday",
		author: "FinOps",
		tags: ["cost", "finance", "capacity"],
		markdown: `# Usage Cost Breakdown\n\n## Monthly Spend\nTotal platform spend reached **$18,420** with the following split:\n\n- Model inference: **$11,220**\n- Vector retrieval: **$3,470**\n- Data processing: **$2,610**\n- Storage + misc: **$1,120**\n\n## Team Allocation\n1. Product intelligence: $6,880\n2. Support automation: $5,430\n3. Security analytics: $3,980\n4. Shared experiments: $2,130\n\n## Optimization Recommendations\n- Migrate low priority nightly jobs to the batch profile.\n- Reduce max token ceiling from 8k to 6k for triage prompts.\n- Keep markdown reports in compressed archival buckets.\n\n> Forecast indicates a 9% increase next month if no controls are applied.`,
	},
	{
		id: "security-scan-summary",
		title: "Security Scan Summary",
		summary: "Vulnerability and policy findings from the latest validation cycle.",
		updatedAt: "2 days ago",
		author: "Security Team",
		tags: ["security", "compliance", "risk"],
		markdown: `# Security Scan Summary\n\n## Scan Scope\nThe scan covered container dependencies, infrastructure templates, and runtime policy rules.\n\n## Findings\n- **0 critical** vulnerabilities\n- **2 high** vulnerabilities\n- **7 medium** vulnerabilities\n- **11 low** vulnerabilities\n\n## Highlights\n- High findings are isolated to an outdated image in staging builds.\n- IAM role review detected one policy with over-broad read scope.\n- No exposed secrets found in repository history checks.\n\n## Mitigation Plan\n1. Patch base image to latest secure digest.\n2. Constrain IAM read permissions to the reports bucket.\n3. Enable weekly signed dependency attestations.\n\n\`\`\`text\nCVE-2026-12001  HIGH   fixed in image digest sha256:9f4...\nCVE-2026-11822  HIGH   fixed in image digest sha256:9f4...\n\`\`\``,
	},
];

const Reports = () => {
	return (
		<section className="page">
			<header className="page-header">
				<h2>Reports</h2>
				<p>
					Browse generated reports, read markdown output, and download in multiple
					formats.
				</p>
			</header>

			<ReportViewer reports={reports} />
		</section>
	);
};

export default Reports;
