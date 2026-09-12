export interface Destination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface RajaOngkirMeta {
  message: string;
  code: number;
  status: string;
}

export interface RajaOngkirEnvelope<T> {
  meta: RajaOngkirMeta;
  data: T;
}
