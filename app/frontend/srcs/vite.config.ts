import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: "public",
    server: {
        port: 4000,
        host: true,
    },
    preview: {
        port: 4000,
        host: true,
    },
});
