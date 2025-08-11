module.exports = {
  content: ["./**/*.html", "./public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        beige: { 50: "#FAF8F4" },
        df: {
          dark: "#0a66c2",
          blue: "#1e90ff",
          light: "#5fb3ff",
          graycap: "#e9e9ec"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Segoe UI', 'Arial']
      },
      boxShadow: {
        soft: "0 8px 24px rgba(10, 102, 194, 0.06)"
      }
    }
  },
  plugins: []
}
