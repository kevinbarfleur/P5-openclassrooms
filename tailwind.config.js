module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      margin: ["hover", "focus"],
      padding: ["hover", "focus"],
      overflow: ["hover", "focus"],
      height: ["hover", "focus"],
      ringWidth: ["active", "hover"],
      ringColor: ["active", "hover"],
      ringOpacity: ["active", "hover"],
    },
  },
  plugins: [],
};
