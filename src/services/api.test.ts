import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "./api";
import { refreshAccessToken } from "./tokenRefresh";

vi.mock("./tokenRefresh", () => ({ refreshAccessToken: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
});

function unauthorized(config: InternalAxiosRequestConfig) {
  return new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
    status: 401,
    statusText: "Unauthorized",
    data: { message: "Invalid credentials" },
    headers: new AxiosHeaders(),
    config,
  });
}

describe("authentication failures", () => {
  it.each(["/auth/login", "/auth/google-login", "/auth/2fa/verify", "/auth/2fa/enroll/confirm"])(
    "preserves the error from %s without refreshing an old session",
    async (url) => {
      sessionStorage.setItem("authToken", "old-token");
      const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
        expect(config.headers.Authorization).toBeUndefined();
        throw unauthorized(config);
      });

      await expect(api.post(url, {}, { adapter })).rejects.toMatchObject({
        response: { status: 401, data: { message: "Invalid credentials" } },
      });
      expect(adapter).toHaveBeenCalledTimes(1);
      expect(refreshAccessToken).not.toHaveBeenCalled();
    },
  );

  it("still refreshes and retries an expired authenticated request", async () => {
    vi.mocked(refreshAccessToken).mockResolvedValue("renewed-token");
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      if (!config._retry) throw unauthorized(config);
      expect(config.headers.Authorization).toBe("Bearer renewed-token");
      return { data: { id: 1 }, status: 200, statusText: "OK", headers: new AxiosHeaders(), config };
    });

    await expect(api.get("/auth/current-user", { adapter })).resolves.toMatchObject({ data: { id: 1 } });
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
