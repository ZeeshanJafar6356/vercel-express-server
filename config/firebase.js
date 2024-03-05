require("dotenv").config();

// Firebase Config
const {
    FIREBASE_TYPE,
    FIREBASE_CERT_URL,
    FIREBASE_AUTH_URI,
    FIREBASE_TOKEN_URI,
    FIREBASE_CLIENT_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_UNIVERSE_DOMAIN,
    FIREBASE_AUTH_PROVIDER_CERT_URL,
} = process.env;

const admin = require("firebase-admin");

const config = {
    type: FIREBASE_TYPE,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    client_id: FIREBASE_CLIENT_ID,
    project_id: FIREBASE_PROJECT_ID,
    private_key: FIREBASE_PRIVATE_KEY,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_x509_cert_url: FIREBASE_CERT_URL,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    universe_domain: FIREBASE_UNIVERSE_DOMAIN,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_CERT_URL,
};

const configJson = JSON.stringify(config);

const firebaseAdmin = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(configJson)),
      });

module.exports = firebaseAdmin;
