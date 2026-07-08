import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReportViewer, { type ReportItem } from "./ReportViewer";

const reports: ReportItem[] = [
	{
		id: "alpha",
		title: "Alpha Report",
		summary: "Initial report",
		updatedAt: "today",
		author: "QA",
		tags: ["alpha"],
		markdown: "# Overview\n\n- Metric one\n- Metric two\n",
	},
	{
		id: "beta",
		title: "Beta Report",
		summary: "Follow-up report",
		updatedAt: "yesterday",
		markdown: "## Findings\n\n1. Cost down\n2. Latency stable\n",
	},
];

describe("ReportViewer", () => {
	it("renders markdown from the selected report", () => {
		render(<ReportViewer reports={reports} />);

		expect(screen.getByText("Overview")).not.toBeNull();
		expect(screen.getByText("Metric one")).not.toBeNull();
		expect(screen.getByText("Metric two")).not.toBeNull();
	});

	it("switches reports from the report list", () => {
		render(<ReportViewer reports={reports} />);

		fireEvent.click(screen.getByRole("button", { name: /beta report/i }));

		expect(screen.getByText("Findings")).not.toBeNull();
		expect(screen.getByText("Cost down")).not.toBeNull();
	});

	it("shows empty-state message when no reports exist", () => {
		render(<ReportViewer reports={[]} />);

		expect(
			screen.getByText("No reports available yet. Generate a report to get started."),
		).not.toBeNull();
	});
});
