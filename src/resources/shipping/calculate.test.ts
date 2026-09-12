import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../../client";
import {
  CalculateResource,
  type DomesticCost,
  type DomesticCostParams,
  type DistrictCost,
  type InternationalCost,
} from "./calculate";

const mockPost = vi.fn();

function createResource() {
  const http = { post: mockPost } as unknown as HttpClient;
  return new CalculateResource(http);
}

function envelope<T>(data: T) {
  return { meta: { message: "ok", code: 200, status: "success" }, data };
}

const domesticParams: DomesticCostParams = {
  origin: 1,
  destination: 2,
  weight: 1000,
  courier: ["jne", "sicepat"],
};

describe("CalculateResource", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("districtCost posts to calculate/district/domestic-cost", async () => {
    const res = envelope([{ cost: 9000 }]);
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.districtCost(domesticParams)).resolves.toEqual(res);
    expect(mockPost).toHaveBeenCalledWith("/calculate/district/domestic-cost", {
      origin: 1,
      destination: 2,
      weight: 1000,
      courier: "jne:sicepat",
    });
  });

  it("domesticCost posts to calculate/domestic-cost", async () => {
    const res = envelope([{ cost: 9000 }]);
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.domesticCost(domesticParams)).resolves.toEqual(res);
    expect(mockPost).toHaveBeenCalledWith("/calculate/domestic-cost", {
      origin: 1,
      destination: 2,
      weight: 1000,
      courier: "jne:sicepat",
    });
  });

  it("internationalCost posts to calculate/international-cost", async () => {
    const res = envelope([{ cost: 963000, currency: "IDR" }]);
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.internationalCost({
        origin: 1,
        destination: 2,
        weight: 1000,
        courier: ["jne"],
      }),
    ).resolves.toEqual(res);
    expect(mockPost).toHaveBeenCalledWith("/calculate/international-cost", {
      origin: 1,
      destination: 2,
      weight: 1000,
      courier: "jne",
    });
  });

  it("includes price only when provided", async () => {
    const res = envelope([]);
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await resource.domesticCost({ ...domesticParams, price: "lowest" });

    expect(mockPost).toHaveBeenCalledWith("/calculate/domestic-cost", {
      origin: 1,
      destination: 2,
      weight: 1000,
      courier: "jne:sicepat",
      price: "lowest",
    });
  });

  it("propagates api errors", async () => {
    mockPost.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(resource.domesticCost(domesticParams)).rejects.toThrow("boom");
  });
});
