// "use client";

// import { useEffect } from "react";

// export function PWARegister() {
//   useEffect(() => {
//     if (!("serviceWorker" in navigator)) {
//       return;
//     }

//     const { hostname } = window.location;
//     const isLocalhost =
//       hostname === "localhost" ||
//       hostname === "127.0.0.1" ||
//       hostname === "::1";

//     if (process.env.NODE_ENV !== "production" && !isLocalhost) {
//       navigator.serviceWorker
//         .getRegistrations()
//         .then((registrations) => {
//           registrations.forEach((registration) => {
//             void registration.unregister();
//           });
//         })
//         .catch(() => {
//           return;
//         });

//       return;
//     }

//     const registerServiceWorker = () => {
//       void navigator.serviceWorker.register("/sw.js", { scope: "/" });
//     };

//     window.addEventListener("load", registerServiceWorker);

//     return () => {
//       window.removeEventListener("load", registerServiceWorker);
//     };
//   }, []);

//   return null;
// }
