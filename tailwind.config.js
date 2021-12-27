module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      backgroundImage: {
        'home-back': "url('./assents/home-back.jpg')"
      }
    }
  },
  variants: {
    extend: {
      padding: ['hover'],
      opacity: ['disabled'],
      cursor:['disabled']
    }
  },
  plugins: [],
}
