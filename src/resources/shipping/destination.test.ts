import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../../client";
import {
  DestinationResource,
  type Province,
  type City,
  type District,
  type SubDistrict,
  type SearchDomestic,
  type SearchInternational,
} from "./destination";

const mockGet = vi.fn();

function createResource() {
  const http = { get: mockGet } as unknown as HttpClient;
  return new DestinationResource(http);
}

function envelope<T>(data: T) {
  return { meta: { message: "ok", code: 200, status: "success" }, data };
}

describe("DestinationResource", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("province calls destination/province", async () => {
    const res = envelope([{ id: 1, name: "DKI JAKARTA", zip_code: "0" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.province()).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/province");
  });

  it("city appends province id to path", async () => {
    const res = envelope([{ id: 22, name: "BANDUNG", zip_code: "40000" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.city(22)).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/city/22");
  });

  it("district appends city id to path", async () => {
    const res = envelope([{ id: 455, name: "COBLONG", zip_code: "40130" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.district(455)).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/district/455");
  });

  it("subDistrict appends district id to path", async () => {
    const res = envelope([{ id: 7011, name: "COBLONG", zip_code: "40130" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.subDistrict(7011)).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/sub-district/7011");
  });

  it("searchDomestic passes search with default limit and offset", async () => {
    const res = envelope([{ id: 1, label: "BANDUNG", zip_code: "0" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.searchDomestic({ search: "bandung" }),
    ).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/domestic-destination", {
      search: "bandung",
      limit: 10,
      offset: 0,
    });
  });

  it("searchDomestic uses provided limit and offset", async () => {
    const res = envelope([]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.searchDomestic({ search: "jakarta", limit: 10, offset: 20 }),
    ).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/destination/domestic-destination", {
      search: "jakarta",
      limit: 10,
      offset: 20,
    });
  });

  it("searchInternational passes search params", async () => {
    const res = envelope([{ country_id: 1, country_name: "MALAYSIA" }]);
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.searchInternational({ search: "malaysia", limit: 5 }),
    ).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith(
      "/destination/international-destination",
      { search: "malaysia", limit: 5, offset: 0 },
    );
  });

  it("propagates api errors", async () => {
    mockGet.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(resource.province()).rejects.toThrow("boom");
  });
});
