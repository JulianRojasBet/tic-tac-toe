const colors = require('tailwindcss/colors')

const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors:{
			transparent: 'transparent',
      current: 'currentColor',
			black: colors.black,
			white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      teal: colors.teal,
      violet: colors.violet,
		},
		extend: {}
	},

	plugins: [
		require('daisyui'),
	]
};

module.exports = config;
