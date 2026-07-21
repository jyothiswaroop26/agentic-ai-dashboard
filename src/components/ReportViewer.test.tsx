import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
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
	const createObjectUrlSpy = vi
		.spyOn(URL, "createObjectURL")
		.mockImplementation(() => "blob:report");
	const revokeObjectUrlSpy = vi
		.spyOn(URL, "revokeObjectURL")
		.mockImplementation(() => undefined);
	const clickSpy = vi
		.spyOn(HTMLAnchorElement.prototype, "click")
		.mockImplementation(() => undefined);

	beforeEach(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		});
	});

	afterEach(() => {
		createObjectUrlSpy.mockClear();
		revokeObjectUrlSpy.mockClear();
		clickSpy.mockClear();
	});

	it("renders markdown from the selected report", () => {
		render(
			<MemoryRouter>
				<ReportViewer reports={reports} />
			</MemoryRouter>,
		);

		expect(screen.getByText("Overview")).not.toBeNull();
		expect(screen.getByText("Metric one")).not.toBeNull();
		expect(screen.getByText("Metric two")).not.toBeNull();
	});

	it("switches reports from the report list", () => {
		render(
			<MemoryRouter>
				<ReportViewer reports={reports} />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: /beta report/i }));

		expect(screen.getByText("Findings")).not.toBeNull();
		expect(screen.getByText("Cost down")).not.toBeNull();
	});

	it("shows empty-state message when no reports exist", () => {
		render(
			<MemoryRouter>
				<ReportViewer reports={[]} />
			</MemoryRouter>,
		);

		expect(
			screen.getByText("No reports available yet. Generate a report to get started."),
		).not.toBeNull();
	});

	it("exports the selected report as JSON", () => {
		render(
			<MemoryRouter>
				<ReportViewer reports={reports} />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: "JSON" }));

		expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
		expect(clickSpy).toHaveBeenCalledTimes(1);
		expect(revokeObjectUrlSpy).toHaveBeenCalledTimes(1);
	});

	it("copies markdown content to clipboard", async () => {
		render(
			<MemoryRouter>
				<ReportViewer reports={reports} />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Copy Markdown" }));

		await waitFor(() => {
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				reports[0].markdown,
			);
		});
	});
});
