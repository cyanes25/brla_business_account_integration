import requests
from Crypto.PublicKey import RSA
from Crypto.Signature.pkcs1_15 import PKCS115_SigScheme
from Crypto.Hash import SHA256
import base64

global_signature = None
global_jwt = None

# Function to read private key
def read_private_key():
    with open('private_key.pem', 'r') as file:
        return RSA.import_key(file.read())

# Function to read public key
def read_public_key():
    with open('public_key.pem', 'r') as file:
        return RSA.import_key(file.read())

# Function to generate signature
def sign_message(private_key, message):
    message_bytes = message.encode()
    hash_obj = SHA256.new(message_bytes)
    signer = PKCS115_SigScheme(private_key)
    signature = signer.sign(hash_obj)
    return base64.b64encode(signature).decode()

# Function to log in
def login_user(email, password):
    global global_jwt
    endpoint = 'https://api.brla.digital:4567/v1/business/login'
    body = {'email': email, 'password': password}

    try:
        response = requests.post(endpoint, json=body)
        response.raise_for_status()
        global_jwt = response.json()['accessToken']
        print('Login successful! Token:', global_jwt)
    except requests.exceptions.RequestException as error:
        print('Error during login:', error.response.json() if error.response else error)

# Function to register API key
def register_api_key(name, private_key_path, public_key_path):
    global global_signature
    private_key = read_private_key()
    public_key = read_public_key().export_key().decode()

    # Generating the signature
    signature = sign_message(private_key, name)
    global_signature = signature
    
    login_user("your_email", "your_password")

    body = {
        'name': name,
        'publicKey': public_key,
        'signature': signature
    }

    headers = {
        'Authorization': f'bearer {global_jwt}'
    }

    try:
        response = requests.post('https://api.brla.digital:4567/v1/business/api-keys', json=body, headers=headers)
        response.raise_for_status()
        print('API Key registered successfully:', response.json())
    except requests.exceptions.RequestException as error:
        print('Error registering API Key:', error.response.json() if error.response else error)
        print(body)

# Replace 'nomeDaChave' with the actual values
register_api_key('main', 'private_key.pem', 'public_key.pem')
