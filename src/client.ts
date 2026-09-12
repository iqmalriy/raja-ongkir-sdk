import { RajaOngkirEnvelope, RajaOngkirMeta } from "./types";

export interface RajaOngkirHttpConfig {
  apiKey: string;
  baseUrl: string;
  apiKeyHeader?: "key" | "x-api-key";
  debug?: boolean;
}

export interface RajaOngkirConfig {
  apiKey: string;
  baseUrl?: string;
  debug?: boolean;
}

export class RajaOngkirError extends Error {
  readonly code: number;
  readonly status: string;

  constructor(meta: RajaOngkirMeta) {
    super(meta.message);
    this.name = "RajaOngkirError";
    this.code = meta.code;
    this.status = meta.status;
  }
}

export class HttpClient {
  private apiKey: string;
  private baseUrl: string;
  private apiKeyHeader: "key" | "x-api-key";
  private debug: boolean;

  constructor(config: RajaOngkirHttpConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.apiKeyHeader = config.apiKeyHeader ?? "key";
    this.debug = config.debug ?? false;
  }

  private authHeaders(): Record<string, string> {
    return { [this.apiKeyHeader]: this.apiKey };
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log(...args);
    }
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number>,
  ): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        url.searchParams.set(k, String(v)),
      );
    }
    const res = await fetch(url, { headers: this.authHeaders() });
    this.log("REQUEST", "GET", url.toString(), this.authHeaders());
    return this.handle<T>(res);
  }

  async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const bodyParams = new URLSearchParams(body as Record<string, string>);
    const res = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams,
    });
    this.log(
      "REQUEST",
      "POST",
      this.baseUrl + path,
      this.authHeaders(),
      bodyParams.toString(),
    );
    return this.handle<T>(res);
  }

  async postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    this.log("REQUEST", "POST", this.baseUrl + path, this.authHeaders(), body);
    return this.handle<T>(res);
  }

  async putJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method: "PUT",
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    this.log("REQUEST", "PUT", this.baseUrl + path, this.authHeaders(), body);
    return this.handle<T>(res);
  }

  private async handle<T>(res: Response): Promise<T> {
    const body = (await res.json().catch(() => undefined)) as
      RajaOngkirEnvelope<T> | undefined;

    this.log("RESPONSE", res.status, body);

    if (!res.ok || body?.meta?.status === "failed") {
      throw new RajaOngkirError(
        body?.meta ?? {
          message: res.statusText,
          code: res.status,
          status: "failed",
        },
      );
    }

    return body as T;
  }
}
