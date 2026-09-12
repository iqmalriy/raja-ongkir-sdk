import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../../client";
import { OrderResource, type StoreOrderParams } from "./order";

const mockPostJson = vi.fn();
const mockPutJson = vi.fn();
const mockGet = vi.fn();

function createResource() {
  const http = {
    postJson: mockPostJson,
    putJson: mockPutJson,
    get: mockGet,
  } as unknown as HttpClient;
  return new OrderResource(http);
}

const orderParams: StoreOrderParams = {
  orderDate: "2024-10-28 23:59:59",
  brandName: "Komship",
  shipperName: "Toko Official Komship",
  shipperPhone: "6281234567689",
  shipperDestinationId: 17588,
  shipperAddress: "order address detail",
  shipperEmail: "test@gmail.com",
  receiverName: "Buyer A",
  receiverPhone: "628123456789",
  receiverDestinationId: 17589,
  receiverAddress: "order destination address detail",
  shipping: "JNT",
  shippingType: "EZ",
  paymentMethod: "COD",
  shippingCost: 22000,
  shippingCashback: 10000,
  serviceFee: 2500,
  additionalCost: 1000,
  grandTotal: 317000,
  codValue: 317000,
  insuranceValue: 1000,
  orderDetails: [
    {
      productName: "Komship package",
      productVariantName: "Komship variant product",
      productPrice: 500000,
      productWidth: 5,
      productHeight: 2,
      productWeight: 5100,
      productLength: 20,
      qty: 1,
      subtotal: 500000,
    },
  ],
};

describe("OrderResource", () => {
  beforeEach(() => {
    mockPostJson.mockReset();
    mockPutJson.mockReset();
    mockGet.mockReset();
  });

  it("stores an order to orders/store", async () => {
    const res = {
      status: "success",
      message: "Order has been created successfully",
      order_id: "1234567890",
    };
    mockPostJson.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.store(orderParams)).resolves.toEqual(res);
    expect(mockPostJson).toHaveBeenCalledWith(
      "/order/api/v1/orders/store",
      expect.objectContaining({
        order_date: "2024-10-28 23:59:59",
        brand_name: "Komship",
        shipper_phone: "6281234567689",
        shipper_destination_id: 17588,
        receiver_phone: "628123456789",
        shipping: "JNT",
        shipping_type: "EZ",
        payment_method: "COD",
        shipping_cost: 22000,
        order_details: [
          {
            product_name: "Komship package",
            product_variant_name: "Komship variant product",
            product_price: 500000,
            product_width: 5,
            product_height: 2,
            product_weight: 5100,
            product_length: 20,
            qty: 1,
            subtotal: 500000,
          },
        ],
      }),
    );
  });

  it("omits pin point fields when not provided", async () => {
    mockPostJson.mockResolvedValue({});
    const resource = createResource();

    await resource.store(orderParams);

    expect(mockPostJson.mock.calls[0][1]).not.toHaveProperty(
      "origin_pin_point",
    );
    expect(mockPostJson.mock.calls[0][1]).not.toHaveProperty(
      "destination_pin_point",
    );
  });

  it("includes pin point fields when provided", async () => {
    mockPostJson.mockResolvedValue({});
    const resource = createResource();

    await resource.store({
      ...orderParams,
      originPinPoint: "origin-pin",
      destinationPinPoint: "dest-pin",
    });

    expect(mockPostJson.mock.calls[0][1]).toMatchObject({
      origin_pin_point: "origin-pin",
      destination_pin_point: "dest-pin",
    });
  });

  it("propagates api errors", async () => {
    mockPostJson.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(resource.store(orderParams)).rejects.toThrow("boom");
  });

  it("cancels an order with order_no", async () => {
    const res = {
      meta: {
        message: "Success cancel order",
        code: 200,
        status: "success",
      },
      data: {},
    };
    mockPutJson.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.cancel("KOM20230607178649")).resolves.toEqual(res);
    expect(mockPutJson).toHaveBeenCalledWith("/order/api/v1/orders/cancel", {
      order_no: "KOM20230607178649",
    });
  });

  it("propagates cancel api errors", async () => {
    mockPutJson.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(resource.cancel("KOM20230607178649")).rejects.toThrow(
      "boom",
    );
  });

  it("fetches order detail with order_no", async () => {
    const res = {
      meta: { message: "Success get order detail", code: 200, status: "success" },
      data: {
        order_no: "KOM20240529383696",
        awb: "",
        order_status: "Diajukan",
        order_date: "29-05-2024",
        brand_name: "Komship",
        shipper_name: "Toko Official Komship",
        shipper_phone: "6281234567689",
        shipper_destination_id: 17588,
        shipper_address: "order address detail",
        receiver_name: "Buyer A",
        receiver_phone: "6281209876543",
        receiver_destination_id: 17589,
        receiver_address: "order destination address detail",
        shipping: "JNT",
        shipping_type: "EZ",
        payment_method: "COD",
        shipping_cost: 22000,
        shipping_cashback: 10000,
        service_fee: 2500,
        additional_cost: 1000,
        grand_total: 317000,
        cod_value: 317000,
        insurance_value: 1000,
        order_details: [
          {
            product_name: "Komship package",
            product_variant_name: "Komship variant product",
            product_weight: 5100,
            product_height: 2,
            product_width: 5,
            product_length: 20,
            product_price: 500000,
            qty: 1,
            subtotal: 500000,
          },
        ],
      },
    };
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(resource.detail("KOM20240529383696")).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith("/order/api/v1/orders/detail", {
      order_no: "KOM20240529383696",
    });
  });

  it("propagates detail api errors", async () => {
    mockGet.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(resource.detail("KOM20240529383696")).rejects.toThrow("boom");
  });

  it("schedules a pickup request", async () => {
    const res = {
      meta: {
        message: "Success Request Pickup",
        code: 201,
        status: "success",
      },
      data: [
        { status: "success", order_no: "KOM20231120124423", awb: "010116230059723" },
        { status: "success", order_no: "KOM20231120167402", awb: "010116230059724" },
      ],
    };
    mockPostJson.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.pickup({
        pickupDate: "2023-06-12",
        pickupTime: "20:00",
        pickupVehicle: "Motor",
        orders: ["KOM20230612190023"],
      }),
    ).resolves.toEqual(res);
    expect(mockPostJson).toHaveBeenCalledWith("/order/api/v1/pickup/request", {
      pickup_date: "2023-06-12",
      pickup_time: "20:00",
      pickup_vehicle: "Motor",
      orders: ["KOM20230612190023"],
    });
  });

  it("propagates pickup api errors", async () => {
    mockPostJson.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(
      resource.pickup({
        pickupDate: "2023-06-12",
        pickupTime: "20:00",
        pickupVehicle: "Truck",
        orders: ["KOM20230612190023"],
      }),
    ).rejects.toThrow("boom");
  });

  it("prints a label for a single order", async () => {
    const res = {
      meta: {
        message: "Generate Print Label success",
        code: 200,
        status: "success",
      },
      data: {
        path: "/storage/label-06-09-2023-03-07-01701059603.pdf",
        base_64: "JVBERi0xLjQK",
      },
    };
    mockPostJson.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.printLabel({ orderNo: "KOM20230906161162", page: "page_5" }),
    ).resolves.toEqual(res);
    expect(mockPostJson).toHaveBeenCalledWith(
      "/order/api/v1/orders/print-label?order_no=KOM20230906161162&page=page_5",
      {},
    );
  });

  it("prints labels for multiple orders joined by comma", async () => {
    mockPostJson.mockResolvedValue({});
    const resource = createResource();

    await resource.printLabel({
      orderNo: ["KOM20230906161162", "KOM20230612190023"],
      page: "page_2",
    });

    expect(mockPostJson).toHaveBeenCalledWith(
      "/order/api/v1/orders/print-label?order_no=KOM20230906161162%2C+KOM20230612190023&page=page_2",
      {},
    );
  });

  it("propagates printLabel api errors", async () => {
    mockPostJson.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(
      resource.printLabel({ orderNo: "KOM20230906161162", page: "page_1" }),
    ).rejects.toThrow("boom");
  });

  it("fetches airway bill history", async () => {
    const res = {
      meta: {
        message: "success get data",
        code: 200,
        status: "success",
      },
      data: {
        airway_bill: "KOMSHIP00120378088",
        last_status: "Retur",
        history: [
          {
            desc: "KURIR SEDANG MENJEMPUT PAKET",
            date: "2023-04-10 11:50:16",
            code: "",
            status: "Pickup",
          },
        ],
      },
    };
    mockGet.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.airwayBillHistory({
        shipping: "JNE",
        airwayBill: "0637132400441624",
      }),
    ).resolves.toEqual(res);
    expect(mockGet).toHaveBeenCalledWith(
      "/order/api/v1/orders/history-airway-bill",
      {
        shipping: "JNE",
        airway_bill: "0637132400441624",
      },
    );
  });

  it("propagates airwayBillHistory api errors", async () => {
    mockGet.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(
      resource.airwayBillHistory({
        shipping: "JNE",
        airwayBill: "0637132400441624",
      }),
    ).rejects.toThrow("boom");
  });

  it("sends a webhook with a leading slash path", async () => {
    const res = {
      meta: {
        code: 200,
        status: "success",
        message: "Success update order status",
      },
    };
    mockPutJson.mockResolvedValue(res);
    const resource = createResource();

    await expect(
      resource.handleWebhook("/your-website-url", {
        order_no: "KOM20230427102158",
        cnote: "8906976878670798",
        status: "Received",
      }),
    ).resolves.toEqual(res);
    expect(mockPutJson).toHaveBeenCalledWith("/your-website-url", {
      order_no: "KOM20230427102158",
      cnote: "8906976878670798",
      status: "Received",
    });
  });

  it("normalizes a webhook path without a leading slash", async () => {
    mockPutJson.mockResolvedValue({});
    const resource = createResource();

    await resource.handleWebhook("your-website-url", {
      order_no: "KOM20230427102158",
      cnote: "8906976878670798",
      status: "Sent",
    });

    expect(mockPutJson).toHaveBeenCalledWith("/your-website-url", {
      order_no: "KOM20230427102158",
      cnote: "8906976878670798",
      status: "Sent",
    });
  });

  it("propagates webhook api errors", async () => {
    mockPutJson.mockRejectedValue(new Error("boom"));
    const resource = createResource();

    await expect(
      resource.handleWebhook("/your-website-url", {
        order_no: "KOM20230427102158",
        cnote: "8906976878670798",
        status: "Return",
      }),
    ).rejects.toThrow("boom");
  });
});