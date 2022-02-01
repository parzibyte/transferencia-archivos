module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,png,ico,eot,woff2,woff,ttf,html,js,json}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'dist/sw.js'
};