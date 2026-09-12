import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../../client";
import { TrackResource, type AwbResponse } from "./track";

const mockPost = vi.fn();

function createResource() {
  const http = { post: mockPost } as unknown as HttpClient;
  return new TrackResource(http);
}

function envelope<T>(data: T) {
  return { meta: { message: "ok", code: 200, status: "success" }, data };
}

describe("TrackResource", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("awb posts to track/waybill with camelCase mapped to snake_case", async () => {
    const res = envelope({ delivered: false, manifest: [] });
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.awb({
        awb: "JNE123456789",
        courier: "jne",
        lastPhoneNumber: 812345678,
      }),
    ).resolves.toEqual(res);

    expect(mockPost).toHaveBeenCalledWith("/track/waybill", {
      awb: "JNE123456789",
      courier: "jne",
      last_phone_number: 812345678,
    });
  });

  it("returns the full awb response envelope", async () => {
    const res: AwbResponse = envelope({
      delivered: true,
      summary: {
        courir_code: "jne",
        courir_name: "JNE",
        waybill_number: "JNE123456789",
        service_code: "CTC",
        waybill_date: "2026-09-11",
        shipper_name: "A",
        receiver_name: "B",
        origin: "Jakarta",
        destination: "Bandung",
        status: "DELIVERED",
      },
      details: {
        waybill_number: "JNE123456789",
        waybill_date: "2026-09-11",
        waybill_time: "10:00",
        weight: 1,
        origin: "Jakarta",
        destination: "Bandung",
        shipper_name: "A",
        shipper_address1: "Jl. A",
        shipper_address2: "",
        shipper_address3: "",
        shipper_city: "Jakarta",
        receiver_name: "B",
        receiver_address1: "Jl. B",
        receiver_address2: "",
        receiver_address3: "",
        receiver_city: "Bandung",
      },
      delivery_status: {
        status: "DELIVERED",
        pod_receiver: "B",
        pod_date: "2026-09-11",
        pod_time: "12:00",
      },
      manifest: [
        {
          manifest_code: "1",
          manifest_description: "Picked up",
          manifest_date: "2026-09-10",
          manifest_time: "08:00",
          city_name: "Jakarta",
        },
      ],
    });
    mockPost.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.awb({
        awb: "JNE123456789",
        courier: "jne",
        lastPhoneNumber: 812345678,
      }),
    ).resolves.toEqual(res);
  });

  it("propagates api errors", async () => {
    mockPost.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(
      resource.awb({ awb: "X", courier: "jne", lastPhoneNumber: 1 }),
    ).rejects.toThrow("boom");
  });
});
