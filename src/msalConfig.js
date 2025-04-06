// src/msalConfig.js
export const msalConfig = {
    auth: {
      clientId: "cb5e355a-66e4-4050-bbea-e58adf70ee48", // 🔁 Replace this
      authority: "https://login.microsoftonline.com/5dd2e9cf-7e8e-47a6-bb1e-592762211965", // 🔁 Replace this
      redirectUri: "http://localhost:5173/chatpage", // or your Vercel URL
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read"],
  };
  