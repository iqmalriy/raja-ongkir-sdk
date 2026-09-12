import { HttpClient } from "../../client";
import { RajaOngkirEnvelope } from "../../types";

export type DomesticCouriers =
  | "jne"
  | "sicepat"
  | "ide"
  | "sap"
  | "ninja"
  | "jnt"
  | "tiki"
  | "wahana"
  | "pos"
  | "sentral"
  | "lion"
  | "rex"
  | "spx"
  | "anteraja";

export type InternationalCouriers = "lion" | "pos" | "expedito" | "ray" | "jne";

export interface CostItem {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface InternationalCostItem extends CostItem {
  currency: string;
  curency_updated_at?: string;
  currency_value: string;
}

export interface CostParams {
  origin: number;
  destination: number;
  weight: number;
  price?: "lowest" | "highest";
}

export interface DistrictCost extends RajaOngkirEnvelope<CostItem[]> {}

export type DomesticCost = RajaOngkirEnvelope<CostItem[]>;

export type InternationalCost = RajaOngkirEnvelope<InternationalCostItem[]>;

export type DomesticCostParams = CostParams & { courier: DomesticCouriers[] };
export type InternationalCostParams = CostParams & {
  courier: InternationalCouriers[];
};

export class CalculateResource {
  constructor(private http: HttpClient) {}

  districtCost(params: DomesticCostParams): Promise<DistrictCost> {
    return this.http.post(`/calculate/district/domestic-cost`, {
      origin: params.origin,
      destination: params.destination,
      weight: params.weight,
      courier: params.courier.join(":"),
      ...(params.price ? { price: params.price } : {}),
    });
  }

  domesticCost(params: DomesticCostParams): Promise<DomesticCost> {
    return this.http.post(`/calculate/domestic-cost`, {
      origin: params.origin,
      destination: params.destination,
      weight: params.weight,
      courier: params.courier.join(":"),
      ...(params.price ? { price: params.price } : {}),
    });
  }

  internationalCost(
    params: InternationalCostParams,
  ): Promise<InternationalCost> {
    return this.http.post(`/calculate/international-cost`, {
      origin: params.origin,
      destination: params.destination,
      weight: params.weight,
      courier: params.courier.join(":"),
      ...(params.price ? { price: params.price } : {}),
    });
  }
}
