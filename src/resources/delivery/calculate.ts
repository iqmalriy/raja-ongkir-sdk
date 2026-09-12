import { HttpClient } from "../../client";
import { RajaOngkirEnvelope } from "../../types";

export interface CalculateDeliveryParams {
  shipperDestinationId: number;
  receiverDestinationId: number;
  originPinPoint: string;
  destinationPinPoint: string;
  weight: number;
  itemValue: number;
  cod?: boolean;
}

export interface CalculateList {
  shipping_name: string;
  service_name: string;
  weight: number;
  is_cod: boolean;
  shipping_cost: number;
  shipping_cashback: number;
  shipping_cost_net: number;
  grandtotal: number;
  service_fee: number;
  net_income: number;
  etd: string;
}

export interface CalculateDeliveryItem {
  calculate_reguler: CalculateList[];
  calculate_cargo: CalculateList[];
  calculate_instant: CalculateList[];
}

export type CalculateDelivery = RajaOngkirEnvelope<CalculateDeliveryItem>;

export class CalculateDeliveryResource {
  constructor(private http: HttpClient) {}
  calculate(params: CalculateDeliveryParams): Promise<CalculateDelivery> {
    const query = {
      shipper_destination_id: params.shipperDestinationId,
      receiver_destination_id: params.receiverDestinationId,
      origin_pin_point: params.originPinPoint,
      destination_pin_point: params.destinationPinPoint,
      weight: params.weight,
      item_value: params.itemValue,
      ...(params.cod !== undefined ? { cod: params.cod ? "yes" : "no" } : {}),
    };
    return this.http.get<CalculateDelivery>("/tariff/api/v1/calculate", query);
  }
}

export type CalculateDeliveryCallable = (
  params: CalculateDeliveryParams,
) => Promise<CalculateDelivery>;

export function createCalculateDeliveryResource(
  http: HttpClient,
): CalculateDeliveryCallable {
  const resource = new CalculateDeliveryResource(http);
  return (params) => resource.calculate(params);
}
