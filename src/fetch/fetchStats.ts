const WAKAPI_BASE_URL = (
  process.env.WAKAPI_BASE_URL ?? "https://code.7ub3s.net"
).replace(/\/$/, "");

const STATS_RANGE = "last_7_days";

interface LanguageStats {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
  hours: number;
  minutes: number;
}

interface CodingActivityData {
  human_readable_total: string;
  languages: LanguageStats[];
}

export interface CodingActivityResponse {
  data: CodingActivityData;
}

function requireApiKey(): string {
  const apiKey = process.env.WAKAPI_API_KEY;
  if (!apiKey) {
    throw new Error("WAKAPI_API_KEY is not set");
  }
  return apiKey;
}

function basicAuthHeader(apiKey: string): string {
  return `Basic ${Buffer.from(apiKey).toString("base64")}`;
}

export async function fetchCodingActivity(): Promise<CodingActivityResponse> {
  const response = await fetch(
    `${WAKAPI_BASE_URL}/api/compat/wakatime/v1/users/current/stats/${STATS_RANGE}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: basicAuthHeader(requireApiKey()),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Wakapi stats ${response.status}: ${response.statusText}`);
  }

  const payload = (await response.json()) as {
    data?: Partial<CodingActivityData> | null;
  };
  const data = payload.data;

  if (!data) {
    throw new Error("Wakapi stats response was empty");
  }

  return {
    data: {
      human_readable_total: data.human_readable_total ?? "0 hrs 0 mins",
      languages: Array.isArray(data.languages) ? data.languages : [],
    },
  };
}
