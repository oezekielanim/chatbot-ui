export const msalConfig = {
    auth: {
      clientId: "YOUR_CLIENT_ID", // From Azure
      authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // From Azure
      redirectUri: "https://chatbot-ui-pearl-psi.vercel.app/chatpage", // Your app URI
    },
    cache: {
      cacheLocation: "sessionStorage", // or "localStorage"
      storeAuthStateInCookie: false,
    },
  };
  