export const GoogleApi = (opts) => {
	opts = opts || {};

	if (!opts.hasOwnProperty('apiKey')) {
		throw new Error('You must pass an apiKey to use GoogleApi');
	}

	const { apiKey, version, url = 'https://maps.googleapis.com/maps/api/js' } = opts;
	//build url string
	const url = () => {
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
