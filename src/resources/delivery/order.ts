import { HttpClient } from "../../client";
import { RajaOngkirEnvelope, RajaOngkirMeta } from "../../types";

export interface StoreOrderDetail {
  productName: string;
  productVariantName: string;
  productPrice: number;
  productWidth: number;
  productHeight: number;
  productWeight: number;
  productLength: number;
  qty: number;
  subtotal: number;
}

export type PaymentMethod = "COD" | "BANK TRANSFER";

export interface StoreOrderParams {
  orderDate: string;
  brandName: string;
  shipperName: string;
  shipperPhone: string;
  shipperDestinationId: number;
  shipperAddress: string;
  shipperEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverDestinationId: number;
  receiverAddress: string;
  shipping: string;
  shippingType: string;
  shippingCost: number;
  shippingCashback: number;
  paymentMethod: PaymentMethod;
  serviceFee: number;
  additionalCost: number;
  grandTotal: number;
  codValue: number;
  insuranceValue: number;
  orderDetails: StoreOrderDetail[];
  originPinPoint?: string;
  destinationPinPoint?: string;
  receiverEmail?: string;
  notes?: string;
}

export interface StoreOrderResult {
  status: string;
  message: string;
  order_id: string;
}

export type CancelOrder = RajaOngkirEnvelope<Record<string, never>>;

export interface OrderDetailItem {
  product_name: string;
  product_variant_name: string;
  product_weight: number;
  product_height: number;
  product_width: number;
  product_length: number;
  product_price: number;
  qty: number;
  subtotal: number;
}

export interface OrderDetailData {
  order_no: string;
  awb: string;
  order_status: string;
  order_date: string;
  brand_name: string;
  shipper_name: string;
  shipper_phone: string;
  shipper_destination_id: number;
  shipper_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_destination_id: number;
  receiver_address: string;
  shipping: string;
  shipping_type: string;
  payment_method: string;
  shipping_cost: number;
  shipping_cashback: number;
  service_fee: number;
  additional_cost: number;
  grand_total: number;
  cod_value: number;
  insurance_value: number;
  order_details: OrderDetailItem[];
}

export type OrderDetail = RajaOngkirEnvelope<OrderDetailData>;

export type PickupVehicle = "Motor" | "Mobil" | "Truck";

export interface PickupOrderParams {
  pickupDate: string;
  pickupTime: string;
  pickupVehicle: PickupVehicle;
  orders: string[];
}

export interface PickupOrderItem {
  status: string;
  order_no: string;
  awb: string;
}

export type PickupOrder = RajaOngkirEnvelope<PickupOrderItem[]>;

export type LabelPage =
  | "page_1"
  | "page_2"
  | "page_4"
  | "page_5"
  | "page_6";

export interface PrintLabelParams {
  orderNo: string | string[];
  page: LabelPage;
}

export interface PrintLabelData {
  path: string;
  base_64: string;
}

export type PrintLabel = RajaOngkirEnvelope<PrintLabelData>;

export interface AirwayBillHistoryParams {
  shipping: string;
  airwayBill: string;
}

export interface AirwayBillHistoryItem {
  desc: string;
  date: string;
  code: string;
  status: string;
}

export interface AirwayBillHistoryData {
  airway_bill: string;
  last_status: string;
  history: AirwayBillHistoryItem[];
}

export type AirwayBillHistory = RajaOngkirEnvelope<AirwayBillHistoryData>;

export type OrderWebhookStatus =
  | "Sent"
  | "Return"
  | "Return Done"
  | "Received";

export interface OrderWebhookPayload {
  order_no: string;
  cnote: string;
  status: OrderWebhookStatus;
}

export interface OrderWebhookResponse {
  meta: RajaOngkirMeta;
}

export class OrderResource {
  constructor(private http: HttpClient) {}

  store(params: StoreOrderParams): Promise<StoreOrderResult> {
    return this.http.postJson<StoreOrderResult>("/order/api/v1/orders/store", {
      order_date: params.orderDate,
      brand_name: params.brandName,
      shipper_name: params.shipperName,
      shipper_phone: params.shipperPhone,
      shipper_destination_id: params.shipperDestinationId,
      shipper_address: params.shipperAddress,
      shipper_email: params.shipperEmail,
      receiver_name: params.receiverName,
      receiver_phone: params.receiverPhone,
      receiver_destination_id: params.receiverDestinationId,
      receiver_address: params.receiverAddress,
      shipping: params.shipping,
      shipping_type: params.shippingType,
      shipping_cost: params.shippingCost,
      shipping_cashback: params.shippingCashback,
      payment_method: params.paymentMethod,
      service_fee: params.serviceFee,
      additional_cost: params.additionalCost,
      grand_total: params.grandTotal,
      cod_value: params.codValue,
      insurance_value: params.insuranceValue,
      order_details: params.orderDetails.map((d) => ({
        product_name: d.productName,
        product_variant_name: d.productVariantName,
        product_price: d.productPrice,
        product_width: d.productWidth,
        product_height: d.productHeight,
        product_weight: d.productWeight,
        product_length: d.productLength,
        qty: d.qty,
        subtotal: d.subtotal,
      })),
      ...(params.notes ? { notes: params.notes } : {}),
      ...(params.receiverEmail ? { receiver_email: params.receiverEmail } : {}),
      ...(params.originPinPoint
        ? { origin_pin_point: params.originPinPoint }
        : {}),
      ...(params.destinationPinPoint
        ? { destination_pin_point: params.destinationPinPoint }
        : {}),
    });
  }

  detail(orderNo: string): Promise<OrderDetail> {
    return this.http.get<OrderDetail>("/order/api/v1/orders/detail", {
      order_no: orderNo,
    });
  }

  cancel(orderNo: string): Promise<CancelOrder> {
    return this.http.putJson<CancelOrder>("/order/api/v1/orders/cancel", {
      order_no: orderNo,
    });
  }

  pickup(params: PickupOrderParams): Promise<PickupOrder> {
    return this.http.postJson<PickupOrder>("/order/api/v1/pickup/request", {
      pickup_date: params.pickupDate,
      pickup_time: params.pickupTime,
      pickup_vehicle: params.pickupVehicle,
      orders: params.orders,
    });
  }

  printLabel(params: PrintLabelParams): Promise<PrintLabel> {
    const orderNo = Array.isArray(params.orderNo)
      ? params.orderNo.join(", ")
      : params.orderNo;
    const query = new URLSearchParams({
      order_no: orderNo,
      page: params.page,
    });
    return this.http.postJson<PrintLabel>(
      `/order/api/v1/orders/print-label?${query.toString()}`,
      {},
    );
  }

  airwayBillHistory(
    params: AirwayBillHistoryParams,
  ): Promise<AirwayBillHistory> {
    return this.http.get<AirwayBillHistory>(
      "/order/api/v1/orders/history-airway-bill",
      {
        shipping: params.shipping,
        airway_bill: params.airwayBill,
      },
    );
  }

  handleWebhook(
    path: string,
    payload: OrderWebhookPayload,
  ): Promise<OrderWebhookResponse> {
    const webhookPath = path.startsWith("/") ? path : `/${path}`;
    return this.http.putJson<OrderWebhookResponse>(
      webhookPath,
      payload as unknown as Record<string, unknown>,
    );
  }
}
