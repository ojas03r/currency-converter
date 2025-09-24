// --- Element Selectors ---
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const swapButton = document.getElementById('swap-button');
const resultDiv = document.getElementById('result');

// --- IMPORTANT: Update these values ---
const API_KEY = "8ba131cbe2d815620d30bc086d0d87a8"; // Paste your API key here
const API_URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

// --- Global variable to store the fetched rates ---
let currencyRates = {}; 

/**
 * Fetches all currency rates (base EUR) and stores them.
 * Also populates the dropdowns.
 */
async function setupConverter() {
    resultDiv.textContent = 'Loading latest rates...';
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch rates from API.');
        
        const data = await response.json();

        if (!data.success) {
            throw new Error(`API Error: ${data.error.info || 'An error occurred.'}`);
        }

        currencyRates = data.rates; // Store the rates object
        
        // Populate dropdowns using the keys from the rates object
        for (const currency in currencyRates) {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            toCurrencySelect.appendChild(option2);
        }
        
        // Set default values
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'INR';

        // Perform initial conversion after setup is complete
        convertCurrency();

    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
        console.error('Error during setup:', error);
    }
}


/**
 * Calculates and displays the converted amount using stored rates.
 */
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount.';
        return;
    }
    
    // Get rates relative to EUR from our stored object
    const fromRate = currencyRates[fromCurrency];
    const toRate = currencyRates[toCurrency];

    // The calculation logic: convert from 'From Currency' to EUR, then from EUR to 'To Currency'
    const amountInEur = amount / fromRate;
    const convertedAmount = amountInEur * toRate;
    
    resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// --- Event Listeners ---
amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);

swapButton.addEventListener('click', () => {
    // Swap the selected values
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    // Recalculate after swapping
    convertCurrency();
});


// --- Initial Setup ---
// When the page is fully loaded, run the setup function
document.addEventListener('DOMContentLoaded', setupConverter);