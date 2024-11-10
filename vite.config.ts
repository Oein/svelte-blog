import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { imageToWebpPlugin } from "vite-plugin-image-to-webp";

export default defineConfig({
  plugins: [
    sveltekit(),
    imageToWebpPlugin({
      webpQuality: {
        quality: 90,
        alphaQuality: 90,
      },
      destinationFolder: "build",
    }),
  ],
});
