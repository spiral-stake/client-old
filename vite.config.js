import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: "0.0.0.0", // To host your local network online
  //   port: 5173, // Optional: specify the port (default is 5173)
  // },
});
