import { HttpClient } from "../../client";
import { RajaOngkirEnvelope } from "../../types";

export interface Destination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export type SearchDestination = RajaOngkirEnvelope<Destination[]>;

export class DestinationDeliveryResource {
  constructor(private http: HttpClient) {}
  search(keyword: string): Promise<SearchDestination> {
    return this.http.get<SearchDestination>(
      "/tariff/api/v1/destination/search",
      {
        keyword,
      },
    );
  }
}
