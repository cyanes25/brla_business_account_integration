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



// Função para registrar o webhook
async function registerWebhook(link) {
const timestamp = Date.now().toString();
const httpMethod='POST'
const endpoint = '/v1/business/webhooks';
const privateKey = readPrivateKey('private_key.pem');
const body = {
    url:link
  };
const message = timestamp + httpMethod + endpoint + JSON.stringify(body);
const Signature = signMessage(privateKey, message);  


  try {

    const response = await axios.post('https://api.brla.digital:4567'+endpoint, body, {
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

registerWebhook('https://0e8b-201-6-247-11.ngrok-free.app');
