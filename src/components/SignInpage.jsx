// import { useState } from "react";
// // import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "./Button";
// import { Input } from "./Input";
// import LmiLogo from "./assets/lmi-logo.jpg";
// import BackgroundImage from "./assets/background.jpg"; // Ensure an appropriate background image is available

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const hardcodedEmail = "user@lmi.com";
//   const hardcodedPassword = "password123";

//   // const handleSignIn = (e) => {
//   //   e.preventDefault(); // Prevents page reload
//   //   if (email === hardcodedEmail && password === hardcodedPassword) {
//   //     navigate("/chatpage"); // Route to chat page after authentication
//   //   } else {
//   //     alert("Invalid email or password. Please try again.");
//   //   }
//   // };

//   const handleSignIn = (e) => {
//     e.preventDefault();
//     if (email === hardcodedEmail && password === hardcodedPassword) {
//       sessionStorage.setItem("authenticated", "true"); // Store session
//       navigate("/chatpage", { replace: true });
//     } else {
//       alert("Invalid email or password. Please try again.");
//     }
//   };

 

//   return (
//     <div
//       className="flex items-center justify-center h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(${BackgroundImage})` }}
//     >
//       <div className="backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md text-center"> 
//         <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4" />
//         <h2 className="text-2xl font-semibold text-red-600 mb-6">LMI Chatbot Sign-In</h2>

//         <form onSubmit={handleSignIn}> {/* Wrap inputs inside a form */}
//           <div className="mb-4">
//             <Input
//               type="email"
//               placeholder="Enter your corporate email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <Input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg">
//             Sign In
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useMsal } from "@azure/msal-react";
import { Button } from "./Button";
import LmiLogo from "./assets/lmi-logo.jpg";
import BackgroundImage from "./assets/background.jpg";

export default function SignInPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().then((response) => {
      console.log("Logged in:", response);
      window.location.href = "/chatpage";
    }).catch(e => {
      console.error(e);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <div className="bg-white backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-6">LMI Chatbot Sign In</h2>
        <Button onClick={handleLogin} className="hover:cursor-pointer bg-blue-500 border-2">Sign in with Microsoft</Button>
      </div>
    </div>
  );
}
