import { Session } from "@/types";

export async function getBearerToken(): Promise<string> {
	try {
		const response = await fetch(`/api/cookies`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const bearerToken = (await response.json()) as string;
		return bearerToken;
	} catch (error) {
		console.error("Failed to fetch Bearer token:", error);
		throw new Error("Network response was not ok");
	}
}