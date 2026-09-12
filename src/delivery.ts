import { HttpClient, RajaOngkirConfig } from "./client";
import { DestinationDeliveryResource } from "./resources/delivery/destination";
import {
  CalculateDeliveryCallable,
  createCalculateDeliveryResource,
} from "./resources/delivery/calculate";
import { OrderResource } from "./resources/delivery/order";
import { formatBaseUrl } from "./helper";

export class RajaOngkirDelivery {
  destination: DestinationDeliveryResource;
  calculate: CalculateDeliveryCallable;
  order: OrderResource;

  constructor(config: RajaOngkirConfig) {
    const baseUrl = formatBaseUrl(
      config.baseUrl ?? "https://api.collaborator.komerce.id",
    );
    const http = new HttpClient({
      apiKey: config.apiKey,
      baseUrl: baseUrl,
      apiKeyHeader: "x-api-key",
      debug: config.debug,
    });
    this.destination = new DestinationDeliveryResource(http);
    this.calculate = createCalculateDeliveryResource(http);
    this.order = new OrderResource(http);
  }
}
