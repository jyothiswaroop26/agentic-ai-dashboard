import { useState } from "react";
import { getResearchRequestResponse, submitResearchRequest } from "../services/api";

type ResearchType =
	| ""
	| "literature-review"
	| "data-analysis"
	| "competitive-analysis"
	| "market-research"
	| "technical-research";

type Priority = "" | "low" | "medium" | "high" | "critical";

type FormFields = {
	topic: string;
	description: string;
	researchType: ResearchType;
	priority: Priority;
	deadline: string;
	tags: string;
	notifyOnComplete: boolean;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const INITIAL_FORM: FormFields = {
	topic: "",
	description: "",
	researchType: "",
	priority: "",
	deadline: "",
	tags: "",
	notifyOnComplete: true,
};

function validate(fields: FormFields): FormErrors {
	const errors: FormErrors = {};

	if (!fields.topic.trim()) {
		errors.topic = "Topic is required.";
	} else if (fields.topic.trim().length < 5) {
		errors.topic = "Topic must be at least 5 characters.";
	} else if (fields.topic.trim().length > 150) {
		errors.topic = "Topic must be 150 characters or fewer.";
	}

	if (!fields.description.trim()) {
		errors.description = "Description is required.";
	} else if (fields.description.trim().length < 20) {
		errors.description = "Description must be at least 20 characters.";
	} else if (fields.description.trim().length > 2000) {
		errors.description = "Description must be 2,000 characters or fewer.";
	}

	if (!fields.researchType) {
		errors.researchType = "Please select a research type.";
	}

	if (!fields.priority) {
		errors.priority = "Please select a priority level.";
	}

	if (fields.deadline) {
		const picked = new Date(fields.deadline);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (picked < today) {
			errors.deadline = "Deadline must be today or a future date.";
		}
	}

	return errors;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

type AiResponsePayload = {
	id: string;
	title: string;
	summary?: string;
	markdown?: string;
	tags?: string[];
	author?: string;
	updatedAt?: string;
};

const ResearchRequest = () => {
	const [form, setForm] = useState<FormFields>(INITIAL_FORM);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
	const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
	const [submittedId, setSubmittedId] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [aiResponse, setAiResponse] = useState<AiResponsePayload | null>(null);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		const newValue =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
		setForm((prev) => ({ ...prev, [name]: newValue }));

		if (touched[name as keyof FormFields]) {
			const updated = { ...form, [name]: newValue };
			const newErrors = validate(updated as FormFields);
			setErrors((prev) => ({
				...prev,
				[name]: newErrors[name as keyof FormFields],
			}));
		}
	};

	const handleBlur = (
		e: React.FocusEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name } = e.target;
		setTouched((prev) => ({ ...prev, [name]: true }));
		const newErrors = validate(form);
		setErrors((prev) => ({
			...prev,
			[name]: newErrors[name as keyof FormFields],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const allTouched = Object.keys(form).reduce(
			(acc, key) => ({ ...acc, [key]: true }),
			{} as Record<keyof FormFields, boolean>
		);
		setTouched(allTouched);

		const validationErrors = validate(form);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length > 0) return;

		setSubmitStatus("loading");
		setSubmitError(null);
		setAiResponse(null);
		setSubmittedId(null);
		try {
			const result = await submitResearchRequest({
				...form,
				tags: form.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});
			setSubmittedId(result.id);

			let nextAiResponse: AiResponsePayload | null =
				result.aiResponse ?? null;

			if (!nextAiResponse && result.id) {
				try {
					nextAiResponse = await getResearchRequestResponse(result.id);
				} catch {
					// The request can still be valid even if response generation is delayed.
					nextAiResponse = null;
				}
			}

			setAiResponse(nextAiResponse);
			setSubmitStatus("success");
			setForm(INITIAL_FORM);
			setTouched({});
			setErrors({});
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: "Please check your connection and try again.",
			);
			setSubmitStatus("error");
		}
	};

	const handleReset = () => {
		setForm(INITIAL_FORM);
		setErrors({});
		setTouched({});
		setSubmitStatus("idle");
		setSubmittedId(null);
		setSubmitError(null);
		setAiResponse(null);
	};

	const isLoading = submitStatus === "loading";

	return (
		<section className="page">
			<header className="page-header">
				<h2>New Research Request</h2>
				<p>
					Submit a structured research task for the AI agent pipeline to
					process.
				</p>
			</header>

			{submitStatus === "success" && (
				<div className="rr-banner rr-banner--success" role="status">
					<span className="rr-banner__icon" aria-hidden="true">✓</span>
					<div>
						<strong>Request submitted successfully!</strong>
						{submittedId && (
							<p className="rr-banner__sub">
								Tracking ID: <code>{submittedId}</code>
							</p>
						)}
						{!aiResponse && (
							<p className="rr-banner__sub">
								Your AI response is being generated and will appear in Reports shortly.
							</p>
						)}
					</div>
					<button
						className="rr-banner__dismiss"
						onClick={handleReset}
						type="button"
					>
						New Request
					</button>
				</div>
			)}

			{submitStatus === "error" && (
				<div className="rr-banner rr-banner--error" role="alert">
					<span className="rr-banner__icon" aria-hidden="true">✕</span>
					<div>
						<strong>Submission failed.</strong>
						<p className="rr-banner__sub">
							{submitError ?? "Please check your connection and try again."}
						</p>
					</div>
					<button
						className="rr-banner__dismiss"
						onClick={() => setSubmitStatus("idle")}
						type="button"
					>
						Dismiss
					</button>
				</div>
			)}

			{submitStatus === "success" && aiResponse && (
				<article className="rr-ai-response panel" aria-live="polite">
					<header className="rr-ai-response__header">
						<div>
							<h3>{aiResponse.title}</h3>
							{aiResponse.summary ? <p>{aiResponse.summary}</p> : null}
						</div>
						<div className="rr-ai-response__meta">
							{aiResponse.author ? <span>Author: {aiResponse.author}</span> : null}
							{aiResponse.updatedAt ? <span>Updated: {aiResponse.updatedAt}</span> : null}
						</div>
					</header>

					{aiResponse.markdown ? (
						<pre className="rr-ai-response__content">{aiResponse.markdown}</pre>
					) : (
						<p className="rr-ai-response__placeholder">
							AI response received. Open Reports for the formatted version.
						</p>
					)}

					{aiResponse.tags?.length ? (
						<div className="rr-ai-response__tags">
							{aiResponse.tags.map((tag) => (
								<span className="rr-ai-response__tag" key={tag}>
									{tag}
								</span>
							))}
						</div>
					) : null}
				</article>
			)}

			<form
				className="rr-form"
				noValidate
				onSubmit={handleSubmit}
				aria-label="Research request form"
			>
				{/* Topic */}
				<div className="rr-field">
					<label className="rr-label" htmlFor="topic">
						Research Topic <span className="rr-required">*</span>
					</label>
					<input
						aria-describedby={errors.topic ? "topic-error" : undefined}
						aria-invalid={!!errors.topic}
						className={`rr-input ${errors.topic ? "rr-input--error" : ""}`}
						disabled={isLoading}
						id="topic"
						maxLength={150}
						name="topic"
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder="e.g. LLM fine-tuning strategies for domain-specific tasks"
						type="text"
						value={form.topic}
					/>
					<div className="rr-field-footer">
						{errors.topic ? (
							<span className="rr-error" id="topic-error" role="alert">
								{errors.topic}
							</span>
						) : (
							<span />
						)}
						<span className="rr-char-count">
							{form.topic.length}/150
						</span>
					</div>
				</div>

				{/* Description */}
				<div className="rr-field">
					<label className="rr-label" htmlFor="description">
						Description <span className="rr-required">*</span>
					</label>
					<textarea
						aria-describedby={
							errors.description ? "description-error" : undefined
						}
						aria-invalid={!!errors.description}
						className={`rr-textarea ${errors.description ? "rr-input--error" : ""}`}
						disabled={isLoading}
						id="description"
						maxLength={2000}
						name="description"
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder="Describe the research goals, context, and expected outputs in detail…"
						rows={5}
						value={form.description}
					/>
					<div className="rr-field-footer">
						{errors.description ? (
							<span className="rr-error" id="description-error" role="alert">
								{errors.description}
							</span>
						) : (
							<span />
						)}
						<span className="rr-char-count">
							{form.description.length}/2000
						</span>
					</div>
				</div>

				{/* Research Type & Priority row */}
				<div className="rr-row">
					<div className="rr-field">
						<label className="rr-label" htmlFor="researchType">
							Research Type <span className="rr-required">*</span>
						</label>
						<select
							aria-describedby={
								errors.researchType ? "researchType-error" : undefined
							}
							aria-invalid={!!errors.researchType}
							className={`rr-select ${errors.researchType ? "rr-input--error" : ""}`}
							disabled={isLoading}
							id="researchType"
							name="researchType"
							onBlur={handleBlur}
							onChange={handleChange}
							value={form.researchType}
						>
							<option value="">— Select type —</option>
							<option value="literature-review">Literature Review</option>
							<option value="data-analysis">Data Analysis</option>
							<option value="competitive-analysis">
								Competitive Analysis
							</option>
							<option value="market-research">Market Research</option>
							<option value="technical-research">Technical Research</option>
						</select>
						{errors.researchType && (
							<span
								className="rr-error"
								id="researchType-error"
								role="alert"
							>
								{errors.researchType}
							</span>
						)}
					</div>

					<div className="rr-field">
						<label className="rr-label" htmlFor="priority">
							Priority <span className="rr-required">*</span>
						</label>
						<select
							aria-describedby={
								errors.priority ? "priority-error" : undefined
							}
							aria-invalid={!!errors.priority}
							className={`rr-select ${errors.priority ? "rr-input--error" : ""}`}
							disabled={isLoading}
							id="priority"
							name="priority"
							onBlur={handleBlur}
							onChange={handleChange}
							value={form.priority}
						>
							<option value="">— Select priority —</option>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="critical">Critical</option>
						</select>
						{errors.priority && (
							<span
								className="rr-error"
								id="priority-error"
								role="alert"
							>
								{errors.priority}
							</span>
						)}
					</div>
				</div>

				{/* Deadline & Tags row */}
				<div className="rr-row">
					<div className="rr-field">
						<label className="rr-label" htmlFor="deadline">
							Deadline{" "}
							<span className="rr-optional">(optional)</span>
						</label>
						<input
							aria-describedby={
								errors.deadline ? "deadline-error" : undefined
							}
							aria-invalid={!!errors.deadline}
							className={`rr-input ${errors.deadline ? "rr-input--error" : ""}`}
							disabled={isLoading}
							id="deadline"
							min={new Date().toISOString().split("T")[0]}
							name="deadline"
							onBlur={handleBlur}
							onChange={handleChange}
							type="date"
							value={form.deadline}
						/>
						{errors.deadline && (
							<span
								className="rr-error"
								id="deadline-error"
								role="alert"
							>
								{errors.deadline}
							</span>
						)}
					</div>

					<div className="rr-field">
						<label className="rr-label" htmlFor="tags">
							Tags{" "}
							<span className="rr-optional">(optional, comma-separated)</span>
						</label>
						<input
							className="rr-input"
							disabled={isLoading}
							id="tags"
							name="tags"
							onChange={handleChange}
							placeholder="e.g. nlp, transformers, benchmarks"
							type="text"
							value={form.tags}
						/>
					</div>
				</div>

				{/* Notification toggle */}
				<div className="rr-field rr-field--inline">
					<input
						className="rr-checkbox"
						disabled={isLoading}
						id="notifyOnComplete"
						name="notifyOnComplete"
						onChange={handleChange}
						type="checkbox"
						checked={form.notifyOnComplete}
					/>
					<label className="rr-label rr-label--inline" htmlFor="notifyOnComplete">
						Notify me when this research task completes
					</label>
				</div>

				{/* Actions */}
				<div className="rr-actions">
					<button
						className="rr-btn rr-btn--ghost"
						disabled={isLoading}
						onClick={handleReset}
						type="button"
					>
						Clear Form
					</button>
					<button
						className="rr-btn rr-btn--primary"
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? (
							<>
								<span className="rr-spinner" aria-hidden="true" />
								Submitting…
							</>
						) : (
							"Submit Request"
						)}
					</button>
				</div>
			</form>
		</section>
	);
};

export default ResearchRequest;
