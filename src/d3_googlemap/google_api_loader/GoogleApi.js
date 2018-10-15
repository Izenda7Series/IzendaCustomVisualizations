export const GoogleApi = (opts) => {
	opts = opts || {};

	if (!opts.hasOwnProperty('apiKey')) {
		throw new Error('You must pass an apiKey to use GoogleApi');
	}

	const version = 'v=3.34'; //version of google map api
	const apiKey = opts.apiKey; // the API Key of google map api
	const URL = opts.url || 'https://maps.googleapis.com/maps/api/js';
	//build url string
	const url = () => {
		let url = URL;
		let params = {
			key: apiKey,
			version
		};

		let paramStr = Object
			.keys(params)
			.filter(k => !!params[k])
			.map(k => `${k}=${params[k]}`)
			.join('&');

		return `${url}?${paramStr}`;
	};

	return url();
};

export default GoogleApi;
