interface LanguageStats {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
}

interface EditorStats {
  total_seconds: number;
  name: string;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
}

interface OperatingSystemStats {
  total_seconds: number;
  name: string;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
}

interface CodingActivityData {
  id: string;
  user_id: string;
  range: string;
  timeout: number;
  writes_only: boolean;
  holidays: number;
  status: string;
  human_readable_total: string;
  is_up_to_date_pending_future: boolean;
  categories: {
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    decimal: string;
    text: string;
    hours: number;
    minutes: number;
  }[];
  is_up_to_date: boolean;
  languages: LanguageStats[];
  editors: EditorStats[];
  operating_systems: OperatingSystemStats[];
  is_stuck: boolean;
  total_seconds_including_other_language: number;
  daily_average_including_other_language: number;
  human_readable_daily_average_including_other_language: string;
  human_readable_total_including_other_language: string;
  days_minus_holidays: number;
  daily_average: number;
  days_including_holidays: number;
  human_readable_daily_average: string;
  percent_calculated: number;
  total_seconds: number;
  is_cached: boolean;
  username: string;
  is_including_today: boolean;
  human_readable_range: string;
  is_coding_activity_visible: boolean;
  is_other_usage_visible: boolean;
}

interface CodingActivityResponse {
  data: CodingActivityData;
}

export async function fetchCodingActivity(): Promise<CodingActivityResponse> {
  const { WAKATIME_KEY: api_key } = process.env;
  try {
    const response = await fetch(
      `https://wakatime.com/api/v1/users/current/stats?range=Last 7 Days&api_key=${api_key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching coding activity: ${response.statusText}`);
    }

    const data: CodingActivityResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch coding activity data:", error);
    throw error; // Re-throwing the error after logging
  }
}
