// Get DOM elements
const amountEl = document.getElementById("amount");
const fromCurrencyEl = document.getElementById("from-currency");
const toCurrencyEl = document.getElementById("to-currency");
const resultEl = document.getElementById("result");
const swapBtn = document.getElementById("swap-button");

// API endpoint
const API_URL = "https://api.exchangerate-api.com/v4/latest/";

// Load currency options
async function loadCurrencies() {
    try {
        const res = await fetch(API_URL + "USD"); // default base currency
        const data = await res.json();
        const currencies = Object.keys(data.rates);

        // Populate select dropdowns
        currencies.forEach(currency => {
            let option1 = new Option(currency, currency);
            let option2 = new Option(currency, currency);

            fromCurrencyEl.add(option1);
            toCurrencyEl.add(option2);
        });

        // Set defaults
        fromCurrencyEl.value = "USD";
        toCurrencyEl.value = "INR";

        // Do initial calculation
        convertCurrency();
    } catch (error) {
        resultEl.innerText = "Error loading currencies!";
    }
}

// Convert function
async function convertCurrency() {
    const amount = parseFloat(amountEl.value);
    const fromCurrency = fromCurrencyEl.value;
    const toCurrency = toCurrencyEl.value;

    if (isNaN(amount) || amount <= 0) {
        resultEl.innerText = "Enter a valid amount!";
        return;
    }

    try {
        const res = await fetch(API_URL + fromCurrency);
        const data = await res.json();
        const rate = data.rates[toCurrency];
        const converted = (amount * rate).toFixed(2);

        resultEl.innerText = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
    } catch (error) {
        resultEl.innerText = "Conversion error!";
    }
}

// Event listeners
amountEl.addEventListener("input", convertCurrency);
fromCurrencyEl.addEventListener("change", convertCurrency);
toCurrencyEl.addEventListener("change", convertCurrency);

swapBtn.addEventListener("click", () => {
    // Swap currencies
    const temp = fromCurrencyEl.value;
    fromCurrencyEl.value = toCurrencyEl.value;
    toCurrencyEl.value = temp;
    convertCurrency();
});

// Initialize
loadCurrencies();
