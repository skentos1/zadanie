import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";

const Converter = () => {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [result, setResult] = useState(0);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [isReversedInput, setIsReversedInput] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/kurzy", {
        params: {
          api_key: "aaaabbbbccccccc",
          currency: "",
        },
      })
      .then((response) => {
        const { rates } = response.data;
        const currencies = rates.map((rate) => rate.name);
        const rateMap = {};
        rates.forEach((rate) => {
          rateMap[rate.name] = rate.rate;
        });
        setRates(rateMap);
        setAvailableCurrencies(currencies);
      })
      .catch((error) => {
        console.error("Error fetching rates:", error);
      });
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      if (!isReversedInput) {
        const rate = rates[toCurrency] / rates[fromCurrency];
        setResult((amount * rate).toFixed(5));
      } else {
        const rate = rates[fromCurrency] / rates[toCurrency];
        setAmount((result * rate).toFixed(5));
      }
    }
  }, [amount, result, fromCurrency, toCurrency, rates, isReversedInput]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleDropdownSelect = (currency, type) => {
    if (type === "from") {
      setFromCurrency(currency);
      setIsFromDropdownOpen(false);
    } else if (type === "to") {
      setToCurrency(currency);
      setIsToDropdownOpen(false);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
    setIsReversedInput(false);
  };

  const handleResultChange = (e) => {
    setResult(Number(e.target.value));
    setIsReversedInput(true);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-full md:w-[700px] flex flex-col mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        {/* Input with label "Suma" */}
        <div className="flex flex-col w-full md:w-[45%]">
          <label htmlFor="amount" className="text-gray-700 font-semibold mb-2">
            Suma
          </label>
          <div className="flex items-center border border-gray-400 rounded-lg px-2 py-1 relative shadow-md">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="flex-1 border-none focus:ring-0 outline-none text-gray-700"
            />
            <div
              className="relative w-[50%] flex items-center cursor-pointer"
              onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
            >
              <ReactCountryFlag
                countryCode={fromCurrency.slice(0, 2)}
                svg
                className="mr-2"
              />
              <span className="text-gray-700">{fromCurrency}</span>
              <svg
                className="w-4 h-4 ml-2 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {isFromDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border rounded-lg z-10 w-full max-h-40 overflow-y-auto">
                  {availableCurrencies.map((currency) => (
                    <div
                      key={currency}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDropdownSelect(currency, "from")}
                    >
                      <ReactCountryFlag
                        countryCode={currency.slice(0, 2)}
                        svg
                        className="mr-2"
                      />
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={swapCurrencies}
          className="text-3xl text-green-700 hover:text-green-900 mx-4 md:mx-2"
        >
          &#8646;
        </button>

        {/* Input with label "Prepočet" */}
        <div className="flex flex-col w-full md:w-[45%]">
          <label htmlFor="result" className="text-gray-700 font-semibold mb-2">
            Prepočet
          </label>
          <div className="flex items-center border border-gray-400 rounded-lg px-2 py-1 relative shadow-md">
            <input
              id="result"
              type="number"
              value={result}
              onChange={handleResultChange}
              className="flex-1 border-none focus:ring-0 outline-none text-gray-700"
            />
            <div
              className="relative w-[50%] flex items-center cursor-pointer"
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <ReactCountryFlag
                countryCode={toCurrency.slice(0, 2)}
                svg
                className="mr-2"
              />
              <span className="text-gray-700">{toCurrency}</span>
              <svg
                className="w-4 h-4 ml-2 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {isToDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border rounded-lg z-10 w-full max-h-40 overflow-y-auto">
                  {availableCurrencies.map((currency) => (
                    <div
                      key={currency}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDropdownSelect(currency, "to")}
                    >
                      <ReactCountryFlag
                        countryCode={currency.slice(0, 2)}
                        svg
                        className="mr-2"
                      />
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="w-full md:w-[45%] text-gray-700 font-bold">
          <p>
            1.00000 {fromCurrency} ={" "}
            <span className="text-blue-700">
              {(rates[toCurrency] / rates[fromCurrency]).toFixed(5)}
            </span>{" "}
            {toCurrency}
          </p>
        </div>
        <button
          onClick={() => setIsReversedInput(false)}
          className="bg-blue-800 text-white px-4 py-2 md:px-9 md:py-3 rounded-xl hover:bg-blue-900 shadow-md w-full md:w-[45%]"
        >
          Prepočítať
        </button>
      </div>
    </div>
  );
};

export default Converter;
