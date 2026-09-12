import { HttpClient, RajaOngkirConfig } from "./client";
import { DestinationResource } from "./resources/shipping/destination";
import { CalculateResource } from "./resources/shipping/calculate";
import { TrackResource } from "./resources/shipping/track";
import { formatBaseUrl } from "./helper";

export class RajaOngkirShipping {
  destination: DestinationResource;
  calculate: CalculateResource;
  track: TrackResource;

  constructor(config: RajaOngkirConfig) {
    const baseUrl = formatBaseUrl(
      config.baseUrl ?? "https://rajaongkir.komerce.id/api/v1",
    );
    const http = new HttpClient({
      apiKey: config.apiKey,
      baseUrl: baseUrl,
      apiKeyHeader: "key",
      debug: config.debug,
    });
    this.destination = new DestinationResource(http);
    this.calculate = new CalculateResource(http);
    this.track = new TrackResource(http);
  }
}
