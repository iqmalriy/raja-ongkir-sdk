import { RajaOngkirError, RajaOngkirShipping } from "../src";

const shipping = new RajaOngkirShipping({
  apiKey: "YOUR_RAJAONGKIR_API_KEY",
  debug: true,
});

async function main() {
  try {
    // --- Destinations ---
    const provinces = await shipping.destination.province();
    console.log("provinces:", provinces.meta, provinces.data.slice(0, 3));

    const cities = await shipping.destination.city(1);
    console.log("cities:", cities.meta, cities.data.slice(0, 3));

    const districts = await shipping.destination.district(39);
    console.log("districts:", districts.meta, districts.data.slice(0, 3));

    const subDistricts = await shipping.destination.subDistrict(72);
    console.log("subDistricts:", subDistricts.meta, subDistricts.data);

    const domestic = await shipping.destination.searchDomestic({
      search: "bandung",
    });
    console.log("domestic search:", domestic.meta, domestic.data);

    const international = await shipping.destination.searchInternational({
      search: "singapore",
    });
    console.log(
      "international search:",
      international.meta,
      international.data,
    );

    // --- Calculate costs ---
    const domesticCost = await shipping.calculate.domesticCost({
      origin: 501,
      destination: 114,
      weight: 1700,
      courier: ["jne", "sicepat"],
      price: "lowest",
    });
    console.log("domestic cost:", domesticCost.meta, domesticCost.data);

    const districtCost = await shipping.calculate.districtCost({
      origin: 501,
      destination: 114,
      weight: 1700,
      courier: ["jne"],
    });
    console.log("district cost:", districtCost.meta, districtCost.data);

    const internationalCost = await shipping.calculate.internationalCost({
      origin: 501,
      destination: 1,
      weight: 500,
      courier: ["pos", "jne"],
    });
    console.log(
      "international cost:",
      internationalCost.meta,
      internationalCost.data,
    );

    // --- Track waybill ---
    const tracking = await shipping.track.awb({
      awb: "JNE0081234567890",
      courier: "jne",
      lastPhoneNumber: 81234567890,
    });
    console.log("tracking:", tracking.meta, tracking.data);
  } catch (err) {
    if (err instanceof RajaOngkirError) {
      console.error(`[${err.code}] ${err.status}: ${err.message}`);
    } else {
      console.error(err);
    }
  }
}

main();
