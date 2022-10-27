const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
const TelnyxRTC = require('@telnyx/webrtc');
const path = require('path');
const jwt = require('jsonwebtoken');

const cors = require('cors');
app.use(cors());

// Import telnyx SDK and use API Key
var telnyx = require('telnyx')(process.env.TELNYX_API_KEY);

const port = process.env.PORT || 3001;


app.get('/', async (req, res) => {
    res.json({ message: "Health Check Passed!" });
});
app.listen(port, () => console.log(`Server started on port ${port} 🚀`));

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    if (token == process.env.AUTH_TOKEN) {
        next()
    }else{
        return res.sendStatus(403);
    }
}

app.get('/generateTokenCredentials', async (req, res) => {
    const telephonyCredentials = await telnyx.telephonyCredentials.create(
        { "connection_id": process.env.CONNECTION_ID }
    );
    const accessToken = await telnyx.telephonyCredentials.generateAccessTokenFromCredential(telephonyCredentials.data.id);
    console.log("Token Generated at : " + new Date());
    res.json(accessToken);
});