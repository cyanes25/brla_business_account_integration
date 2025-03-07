const fs = require('fs');
const axios = require('axios');

let globalJwt;

async function loginUser(email, password) {
  const endpoint = 'https://api.brla.digital:5567/v1/business/login';
  const body = { email, password };

  try {
    const response = await axios.post(endpoint, body);
    globalJwt = response.data.accessToken;
    console.log('Login successful! Token:', globalJwt);
  } catch (error) {
    console.error('Error during login:', error.response.data || error.message);
  }
}

async function fastQuote(amount, inputCoin, outputCoin ) {
  await loginUser("your_email", "your_password");
  const endpoint = `/v1/business/fast-quote?operation=pix-to-usd&amount=${amount}&chain=Polygon&inputCoin=${inputCoin}&outputCoin=${outputCoin}`;

  try {
    const response = await axios.get('https://api.brla.digital:5567' + endpoint, {
      headers: {
        'Authorization': 'bearer ' + globalJwt,
      },
    });
    console.log('Request successful:', response.data);
    return response.data; // Make sure to return the data if you need it
  } catch (error) {
    console.error('Error:', error.response.data || error.message);
  }
}

async function closeDeal(token, markupAddress, receiverAddress) {
  const endpoint = `/v1/business/pay-in/pix-to-usd`;
  const body = { token, markupAddress, receiverAddress };

  try {
    const response = await axios.post('https://api.brla.digital:5567' + endpoint, body, {
      headers: {
        'Authorization': 'bearer ' + globalJwt,
      },
    });
    console.log('Request successful:', response.data);
    return response.data; // Return the data if you need it
  } catch (error) {
    console.error('Error:', error.response.data || error.message);
  }
}

// Wrap the top-level code in an async function
(async function main() {
  const quoteResponse = await fastQuote(100, 'BRLA', 'USDC');
  if (quoteResponse && quoteResponse.token) {
    const externalWallet='0x907972d06bCa1CE2563338212aBA911045B5Bd8D'
    const closeResponse = await closeDeal(quoteResponse.token, externalWallet, externalWallet);
    console.log("quoteResponse: ", quoteResponse);
    console.log("closeResponse: ", closeResponse);
  }
})();
