/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1e40af", // Blue-800
                secondary: "#1e293b", // Slate-800
                accent: "#3b82f6", // Blue-500
            },
        },
    },
    plugins: [],
}
