import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import netlify from "@marko/run-adapter-netlify"; // Import the adapter

export default defineConfig({
  plugins: [
    marko({
      adapter: netlify({ edge: true }), // Configure and apply the adapter
    }),
  ],
});
