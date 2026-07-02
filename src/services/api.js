const API_BASE = "/api";

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
		await new Promise((resolve) => setTimeout(resolve, 1400));
		return { id: `RR-${Date.now()}` };
	}

	const response = await fetch(`${API_BASE}/research-requests`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const message = await response.text().catch(() => "Unknown error");
		throw new Error(`Request failed (${response.status}): ${message}`);
	}

	return response.json();
}

/**
 * Fetch all research requests.
 * @returns {Promise<object[]>}
 */
export async function getResearchRequests() {
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, 600));
		return [];
	}

	const response = await fetch(`${API_BASE}/research-requests`);
	if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
	return response.json();
}
