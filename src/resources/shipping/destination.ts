import { HttpClient } from "../../client";
import { RajaOngkirEnvelope } from "../../types";

export interface Location {
  id: number;
  name: string;
}

export interface SubDistrictLocation extends Location {
  zip_code: string;
}

export interface Destination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface InternationalDestination {
  country_id: string;
  country_name: string;
}

export type Province = RajaOngkirEnvelope<Location[]>;
export type City = RajaOngkirEnvelope<Location[]>;
export type District = RajaOngkirEnvelope<Location[]>;
export type SubDistrict = RajaOngkirEnvelope<SubDistrictLocation[]>;
export type SearchDomestic = RajaOngkirEnvelope<Destination[]>;
export type SearchInternational = RajaOngkirEnvelope<
  InternationalDestination[]
>;

export interface SearchParams {
  search: string;
  limit?: number;
  offset?: number;
}

export class DestinationResource {
  constructor(private http: HttpClient) {}

  province(): Promise<Province> {
    return this.http.get<Province>("/destination/province");
  }

  city(provinceId: number): Promise<City> {
    return this.http.get<City>(`/destination/city/${provinceId}`);
  }

  district(cityId: number): Promise<District> {
    return this.http.get<District>(`/destination/district/${cityId}`);
  }

  subDistrict(districtId: number): Promise<SubDistrict> {
    return this.http.get<SubDistrict>(
      `/destination/sub-district/${districtId}`,
    );
  }

  searchDomestic({
    search,
    limit = 10,
    offset = 0,
  }: SearchParams): Promise<SearchDomestic> {
    return this.http.get<SearchDomestic>("/destination/domestic-destination", {
      search,
      limit,
      offset,
    });
  }

  searchInternational({
    search,
    limit = 10,
    offset = 0,
  }: SearchParams): Promise<SearchInternational> {
    return this.http.get<SearchInternational>(
      "/destination/international-destination",
      { search, limit, offset },
    );
  }
}
