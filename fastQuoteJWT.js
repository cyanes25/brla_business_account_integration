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
    await loginUser("cyanes@brla.digital", "Poliuyt16@")    
const endpoint = `/v1/business/fast-quote?operation=swap&amount=${amount}&chain=Polygon&inputCoin=${inputCoin}&outputCoin=${outputCoin}`;


  try {

    const response = await axios.get('https://api.brla.digital:5567'+endpoint, {
      headers: {
        'Authorization': 'bearer ' + globalJwt,
      },
    });

    console.log('Request successful:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data || error.message);
  
   
  }
}

fastQuote(100, 'BRLA', 'USDT');
