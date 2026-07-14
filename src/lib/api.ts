export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

const BASE_URL = API_BASE;

export interface ApiErrorBody {
  error: string;
  details?: Record<string, string[]>;
}

/** Error thrown for any non-2xx response, carrying the parsed backend payload. */
export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.error ?? "Erro inesperado. Tente novamente.");
    this.name = "ApiError";
    this.status = status;
    this.details = body?.details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

/** Thin typed fetch wrapper. Sends cookies (refresh token) and Bearer access token. */
export async function api<T = unknown>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data =
    res.status === 204
      ? null
      : await res.json().catch(() => null);

  if (!res.ok) throw new ApiError(res.status, data as ApiErrorBody | null);
  return data as T;
}
