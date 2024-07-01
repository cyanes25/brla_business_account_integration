const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/', (req, res) => {
    const bodyBytes = Buffer.from(JSON.stringify(req.body));

    const base64Signature = req.headers.signature;
    if (!base64Signature) {
        return res.status(400).send('Signature header missing');
    }

    let signature;
    try {
        signature = Buffer.from(base64Signature, 'base64');
    } catch (err) {
        return res.status(400).send('Invalid signature format');
    }

    const hash = crypto.createHash('sha256');
    hash.update(bodyBytes);
    const hashedBody = hash.digest();

    // Load the public key from a file
    const pubKeyPath = path.join(__dirname, 'public_key.pem');
    fs.readFile(pubKeyPath, (err, pubKey) => {
        if (err) {
            return res.status(500).send('Failed to load public key');
        }

        const verify = crypto.createVerify('SHA256');
        verify.update(hashedBody);

        if (!verify.verify(pubKey, signature)) {
            return res.status(400).send('Invalid signature');
        }

        // If signature is valid, proceed with your logic
        res.send('Signature validated successfully');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
