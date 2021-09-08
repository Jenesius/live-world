import postcss from 'rollup-plugin-postcss'
export default [
	{
		input: 'assets/js/index.js',
		output: {
			file: 'bundle.js',
			format: 'es'
		},
		plugins: [
			postcss({
				plugins: [],
				extract: true,
			}),
		
		]
	},
	{
		input: "pages/generator/index.js",
		output: {
			file: 'pages/generator/bundle.js',
			format: 'es'
		},
		plugins: [
			postcss({
				plugins: [],
				extract: true,
			}),
		]
	}
]

