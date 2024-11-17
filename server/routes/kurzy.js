// routes/kurzy.js

import express from "express";
import axios from "axios";
import { parseString } from "xml2js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Načítanie dát z XML API
    const response = await axios.get(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"
    );
    const xmlData = response.data;

    // Konverzia XML do JSON
    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Chyba pri parsovaní XML dát." });
      }

      // Navigácia k menovým kurzom
      const ratesArray = result["gesmes:Envelope"].Cube.Cube.Cube;

      // Transformácia dát do požadovaného formátu
      let rates = ratesArray.map((item) => ({
        name: item.$.currency,
        rate: parseFloat(item.$.rate),
      }));

      // Pridanie EUR s kurzom 1.0
      rates.push({
        name: "EUR",
        rate: 1.0,
      });

      // Vytvorenie objektu "rate" s mapovaním meny na kurz
      const rateObject = {};
      rates.forEach((item) => {
        rateObject[item.name] = item.rate;
      });

      // Aplikácia filtrovania, ak sú prítomné query parametre
      const { currency } = req.query;
      if (currency) {
        const currencies = currency
          .split(",")
          .map((cur) => cur.trim().toUpperCase());

        // Vždy pridáme "EUR" do zoznamu mien na filtrovanie
        if (!currencies.includes("EUR")) {
          currencies.push("EUR");
        }

        // Filtrovanie poľa rates
        rates = rates.filter((rate) => currencies.includes(rate.name));

        // Filtrovanie objektu rateObject
        Object.keys(rateObject).forEach((key) => {
          if (!currencies.includes(key)) {
            delete rateObject[key];
          }
        });
      }

      res.json({
        date: result["gesmes:Envelope"].Cube.Cube.$.time,
        rate: rateObject,
        rates: rates,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Nepodarilo sa načítať dáta z externého API." });
  }
});

export default router;
