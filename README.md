# RajaOngkir SDK

[rajaongkir.com](https://rajaongkir.com/)

[![npm](https://img.shields.io/npm/v/raja-ongkir-sdk)](https://www.npmjs.com/package/raja-ongkir-sdk)
[![License](https://img.shields.io/github/license/iqmalriy/raja-ongkir-sdk)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/github/package-json/node/iqmalriy/raja-ongkir-sdk)](https://nodejs.org)

> **Caution:** This is an **unofficial** SDK. It was created to help TypeScript / Node.js developers call the Raja Ongkir API. This SDK does **not** include APIs for **Payment** and **QRISLY** Raja Ongkir.

---

A typed, promise-based TypeScript client for the Komship **RajaOngkir** and **Komship Delivery (Collaborator)** APIs. Zero-config, built on the native `fetch` API.

- **Shipping** (`RajaOngkirShipping`) — RajaOngkir core API: destinations, shipping costs, and waybill tracking.
- **Delivery** (`RajaOngkirDelivery`) — Komship Collaborator API: order management, pickup, labels, and airway-bill history.

## Features

- Full TypeScript type definitions for requests and responses
- Automatic API-key authentication header (`key` or `x-api-key`)
- Consistent `{ meta, data }` envelope handling with typed payloads
- `RajaOngkirError` thrown with `code` and `status` on failed/non-OK responses
- Optional `debug` flag for request/response logging
- No runtime dependencies (uses global `fetch`)

## Installation

```bash
npm install raja-ongkir-sdk
```

## Getting Started

### RajaOngkir Shipping API

```ts
import { RajaOngkirShipping } from "raja-ongkir-sdk";

const shipping = new RajaOngkirShipping({
  apiKey: "YOUR_RAJAONGKIR_API_KEY",
});
```

Default base URL: `https://rajaongkir.komerce.id/api/v1`

### Komship Delivery API

```ts
import { RajaOngkirDelivery } from "raja-ongkir-sdk";

const delivery = new RajaOngkirDelivery({
  apiKey: "YOUR_KOMSHIP_API_KEY",
  debug: true,
});
```

Default base URL: `https://api.collaborator.komerce.id`

### Sandbox

Both clients accept an optional `baseUrl`. Point the delivery client at the sandbox like so:

```ts
const delivery = new RajaOngkirDelivery({
  apiKey: "YOUR_SANDBOX_API_KEY",
  baseUrl: "https://api-sandbox.collaborator.komerce.id",
});
```

## Configuration

| Option    | Type      | Default                                 | Description                         |
| --------- | --------- | --------------------------------------- | ----------------------------------- |
| `apiKey`  | `string`  | — (required)                            | Your API key                        |
| `baseUrl` | `string`  | Shipping / Delivery default (see above) | API base URL (overrides default)    |
| `debug`   | `boolean` | `false`                                 | Log outgoing requests and responses |

## Errors

All non-`2xx` responses, or responses whose `meta.status` is `failed`, throw a `RajaOngkirError`:

```ts
import { RajaOngkirError } from "raja-ongkir-sdk";

try {
  await shipping.destination.province();
} catch (err) {
  if (err instanceof RajaOngkirError) {
    console.log(err.code, err.status, err.message);
  }
}
```

## Shipping API

### Destinations

| Method | Endpoint                                 | SDK Call                                           | Documentation                                                                                                                                      |
| ------ | ---------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/destination/province`                  | `shipping.destination.province()`                  | [search_province](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/search_province)                      |
| GET    | `/destination/city/{provinceId}`         | `shipping.destination.city(provinceId)`            | [search_city](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/search_city)                              |
| GET    | `/destination/district/{cityId}`         | `shipping.destination.district(cityId)`            | [search_district](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/search_district)                      |
| GET    | `/destination/sub-district/{districtId}` | `shipping.destination.subDistrict(districtId)`     | [search_subdistrict](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/search_subdistrict)                |
| GET    | `/destination/domestic-destination`      | `shipping.destination.searchDomestic(params)`      | [search-destination-rajaongkir](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-search-base/search-destination-rajaongkir)       |
| GET    | `/destination/international-destination` | `shipping.destination.searchInternational(params)` | [search-international-destination](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-search-base/search-international-destination) |

```ts
// All provinces
const provinces = await shipping.destination.province();

// Cities of a province
const cities = await shipping.destination.city(1);

// Districts of a city
const districts = await shipping.destination.district(39);

// Sub-districts of a district
const subDistricts = await shipping.destination.subDistrict(72);

// Search domestic destinations
const domestic = await shipping.destination.searchDomestic({
  search: "bandung",
  limit: 10,
  offset: 0,
});

// Search international destinations
const international = await shipping.destination.searchInternational({
  search: "singapore",
});
```

### Calculate Costs

| Method | Endpoint                            | SDK Call                                       | Documentation                                                                                                                              |
| ------ | ----------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/calculate/district/domestic-cost` | `shipping.calculate.districtCost(params)`      | [calculate-cost](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/calculate-cost)                |
| POST   | `/calculate/domestic-cost`          | `shipping.calculate.domesticCost(params)`      | [calculate-domestic-cost](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-search-base/calculate-domestic-cost)           |
| POST   | `/calculate/international-cost`     | `shipping.calculate.internationalCost(params)` | [calculate-international-cost](https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-search-base/calculate-international-cost) |

```ts
const cost = await shipping.calculate.domesticCost({
  origin: 501,
  destination: 114,
  weight: 1700,
  courier: ["jne", "sicepat"],
  price: "lowest",
});

const districtCost = await shipping.calculate.districtCost({
  origin: 501,
  destination: 114,
  weight: 1700,
  courier: ["jne"],
});

const internationalCost = await shipping.calculate.internationalCost({
  origin: 501,
  destination: 1,
  weight: 500,
  courier: ["pos", "jne"],
});
```

### Track Waybill

| Method | Endpoint         | SDK Call                     | Documentation                                                  |
| ------ | ---------------- | ---------------------------- | -------------------------------------------------------------- |
| POST   | `/track/waybill` | `shipping.track.awb(params)` | [tracking](https://rajaongkir.com/docs/shipping-cost/tracking) |

```ts
const result = await shipping.track.awb({
  awb: "JNE0081234567890",
  courier: "jne",
  lastPhoneNumber: 81234567890,
});
```

## Delivery API

### Destination

| Method | Endpoint                            | SDK Call                               | Documentation                                                                           |
| ------ | ----------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| GET    | `/tariff/api/v1/destination/search` | `delivery.destination.search(keyword)` | [search-destination](https://rajaongkir.com/docs/delivery-order-api/search-destination) |

### Calculate

| Method | Endpoint                   | SDK Call                     | Documentation                                                         |
| ------ | -------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| GET    | `/tariff/api/v1/calculate` | `delivery.calculate(params)` | [calculate](https://rajaongkir.com/docs/delivery-order-api/calculate) |

### Orders

| Method | Endpoint                      | SDK Call                         | Documentation                                                                         |
| ------ | ----------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| POST   | `/order/api/v1/orders/store`  | `delivery.order.store(params)`   | [store_order](https://rajaongkir.com/docs/delivery-order-api/Store_order/store_order) |
| GET    | `/order/api/v1/orders/detail` | `delivery.order.detail(orderNo)` | [detail_order](https://rajaongkir.com/docs/delivery-order-api/detail_order)           |
| PUT    | `/order/api/v1/orders/cancel` | `delivery.order.cancel(orderNo)` | [cancel_order](https://rajaongkir.com/docs/delivery-order-api/cancel_order)           |

#### Store a new order

```ts
// Store a new order
const result = await delivery.order.store({
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
});

// Order detail
const detail = await delivery.order.detail("KOM20240529383696");

// Cancel an order
await delivery.order.cancel("KOM20230607178649");
```

### Pickup

| Method | Endpoint                       | SDK Call                        | Documentation                                                               |
| ------ | ------------------------------ | ------------------------------- | --------------------------------------------------------------------------- |
| POST   | `/order/api/v1/pickup/request` | `delivery.order.pickup(params)` | [pickup_order](https://rajaongkir.com/docs/delivery-order-api/pickup_order) |

```ts
const pickup = await delivery.order.pickup({
  pickupDate: "2023-06-12",
  pickupTime: "20:00",
  pickupVehicle: "Motor", // "Motor" | "Mobil" | "Truck"
  orders: ["KOM20230612190023", "KOM20230612190024"],
});
```

### Print Label

| Method | Endpoint                           | SDK Call                            | Documentation                                                             |
| ------ | ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| POST   | `/order/api/v1/orders/print-label` | `delivery.order.printLabel(params)` | [label_order](https://rajaongkir.com/docs/delivery-order-api/label_order) |

```ts
const label = await delivery.order.printLabel({
  orderNo: "KOM20230906161162", // or an array of order numbers
  page: "page_5", // page_1 | page_2 | page_4 | page_5 | page_6
});
```

### Airway Bill History

| Method | Endpoint                                   | SDK Call                                   | Documentation                                                             |
| ------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------- |
| GET    | `/order/api/v1/orders/history-airway-bill` | `delivery.order.airwayBillHistory(params)` | [history_awb](https://rajaongkir.com/docs/delivery-order-api/history_awb) |

```ts
const history = await delivery.order.airwayBillHistory({
  shipping: "JNE",
  airwayBill: "0637132400441624",
});
```

### Webhook

The webhook is an outbound `PUT` that Komship expects you to call against the configured base URL (`{baseUrl}/{yourwebsiteurl}`) whenever an order status changes.

| Method | Endpoint            | SDK Call                                     | Documentation                                                     |
| ------ | ------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| PUT    | `/{yourwebsiteurl}` | `delivery.order.handleWebhook(path, params)` | [webhook](https://rajaongkir.com/docs/delivery-order-api/webhook) |

```ts
const response = await delivery.order.handleWebhook("/your-website-url", {
  order_no: "KOM20230427102158",
  cnote: "8906976878670798",
  status: "Received", // "Sent" | "Return" | "Return Done" | "Received"
});
```

## Development

```bash
# Run tests
npm test

# Run the example script
npm run example

# Build
npm run build
```

## License

[MIT](./LICENSE)
