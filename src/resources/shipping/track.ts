import { HttpClient } from "../../client";
import { RajaOngkirEnvelope } from "../../types";

export type AwbCourier =
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

export interface AwbParams {
  awb: string;
  courier: AwbCourier;
  lastPhoneNumber: number;
}

export interface AwbSummary {
  courir_code: string;
  courir_name: string;
  waybill_number: string;
  service_code: string;
  waybill_date: string;
  shipper_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: string;
}

export interface AwbDetails {
  waybill_number: string;
  waybill_date: string;
  waybill_time: string;
  weight: number;
  origin: string;
  destination: string;
  shipper_name: string;
  shipper_address1: string;
  shipper_address2: string;
  shipper_address3: string;
  shipper_city: string;
  receiver_name: string;
  receiver_address1: string;
  receiver_address2: string;
  receiver_address3: string;
  receiver_city: string;
}

export interface AwbDeliveryStatus {
  status: string;
  pod_receiver: string;
  pod_date: string;
  pod_time: string;
}

export interface AwbManifest {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export interface Awb {
  delivered: boolean;
  summary: AwbSummary;
  details: AwbDetails;
  delivery_status: AwbDeliveryStatus;
  manifest: AwbManifest[];
}

export type AwbResponse = RajaOngkirEnvelope<Awb>;

export class TrackResource {
  constructor(private http: HttpClient) {}

  awb(params: AwbParams): Promise<AwbResponse> {
    return this.http.post("/track/waybill", {
      awb: params.awb,
      courier: params.courier,
      last_phone_number: params.lastPhoneNumber,
    });
  }
}
