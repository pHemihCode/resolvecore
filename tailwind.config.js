/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1E3A8A",

        background: "#F9FAFB",
        card: "#FFFFFF",
        border: "#E5E7EB",

        textPrimary: "#111827",
        textSecondary: "#6B7280",

        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
        info: "#3B82F6",

        aiPurple: "#7C3AED",
        aiPurpleLight: "#F5F3FF",

        // Dark mode colors
        darkBg: "#0F172A",
        darkCard: "#1E293B",
        darkBorder: "#334155",
        darkText: "#F1F5F9",
      },
      keyframes: {
        fadeInFloat: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-in-float":
          "fadeInFloat 0.8s ease-out forwards, float 6s ease-in-out infinite 0.8s",
      },
    },
  },
  plugins: [],
};
