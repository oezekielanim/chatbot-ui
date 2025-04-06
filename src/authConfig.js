export const msalConfig = {
    auth: {
      clientId: "YOUR_CLIENT_ID", // From Azure
      authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // From Azure
      redirectUri: "http://localhost:5173/chatpage", // Your app URI
    },
    cache: {
      cacheLocation: "sessionStorage", // or "localStorage"
      storeAuthStateInCookie: false,
    },
  };
  