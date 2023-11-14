const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');


// Função para ler chave privada
function readPrivateKey() {
  return fs.readFileSync('private_key.pem', 'utf8');
}

// Função para ler chave pública
function readPublicKey() {
  return fs.readFileSync('public_key.pem', 'utf8');
}

// Função para gerar a assinatura
function signMessage(privateKey, message) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  return sign.sign(privateKey, 'base64');
}



async function generateBrCode(amount, referenceLabel) {
const timestamp = Date.now().toString();
const httpMethod='GET'
const endpoint = `/v1/business/pay-in/br-code?amount=${amount}&referenceLabel=${referenceLabel}`;
const privateKey = readPrivateKey('private_key.pem');

const message = timestamp + httpMethod + endpoint;
const Signature = signMessage(privateKey, message);  


  try {

    const response = await axios.get('https://api.brla.digital:5567'+endpoint, {
      headers: {
        'X-API-Timestamp': timestamp,
        'X-API-Key': 'your_api_key',
        'X-API-Signature': Signature,
      },
    });

    console.log('Request successful:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data || error.message);
  
   
  }
}

generateBrCode(0, 'example');
