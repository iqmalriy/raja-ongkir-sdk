import {
  RajaOngkirError,
  RajaOngkirDelivery,
} from "../src";

const delivery = new RajaOngkirDelivery({
  baseUrl: "https://api-sandbox.collaborator.komerce.id",
  apiKey: "YOUR_KOMSHIP_API_KEY",
  debug: true,
});

async function main() {
  try {
    // --- Destination search ---
    const destinations = await delivery.destination.search("jawa tengah");
    console.log("destinations:", destinations.meta, destinations.data);

    // --- Calculate shipping cost ---
    const calculate = await delivery.calculate({
      shipperDestinationId: 17588,
      receiverDestinationId: 17589,
      originPinPoint: "110.423666,-6.982825",
      destinationPinPoint: "106.827073,-6.560351",
      weight: 1000,
      itemValue: 500000,
      cod: true,
    });
    console.log("calculate:", calculate.meta, calculate.data);

    // --- Store an order ---
    const stored = await delivery.order.store({
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
    console.log("stored order:", stored);

    // --- Order detail ---
    const detail = await delivery.order.detail("KOM20240529383696");
    console.log("order detail:", detail.meta, detail.data);

    // --- Cancel an order ---
    const cancelled = await delivery.order.cancel("KOM20230607178649");
    console.log("cancelled:", cancelled.meta, cancelled.data);

    // --- Schedule a pickup ---
    const pickup = await delivery.order.pickup({
      pickupDate: "2023-06-12",
      pickupTime: "20:00",
      pickupVehicle: "Motor",
      orders: ["KOM20230612190023"],
    });
    console.log("pickup:", pickup.meta, pickup.data);

    // --- Print a label ---
    const label = await delivery.order.printLabel({
      orderNo: "KOM20230906161162",
      page: "page_5",
    });
    console.log("label:", label.meta, label.data.path);

    // --- Airway bill history ---
    const history = await delivery.order.airwayBillHistory({
      shipping: "JNE",
      airwayBill: "0637132400441624",
    });
    console.log("history:", history.meta, history.data);

    // --- Webhook ---
    const webhook = await delivery.order.handleWebhook("/your-website-url", {
      order_no: "KOM20230427102158",
      cnote: "8906976878670798",
      status: "Received",
    });
    console.log("webhook:", webhook.meta);
  } catch (err) {
    if (err instanceof RajaOngkirError) {
      console.error(`[${err.code}] ${err.status}: ${err.message}`);
    } else {
      console.error(err);
    }
  }
}

main();