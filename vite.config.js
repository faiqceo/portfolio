import { defineConfig } from 'vite';

// The site is plain HTML/CSS/JS — index.html, style.css, script.js. Vite is
// here only to bundle and hash assets for the dist build; there is no React
// island and no Tailwind left to compile.
export default defineConfig({});
