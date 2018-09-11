export const GoogleApi = function (opts) {
		opts = opts || {};

		if (!opts.hasOwnProperty('apiKey')) {
				throw new Error('You must pass an apiKey to use GoogleApi');
		}

		const apiKey = opts.apiKey;
		const URL = opts.url || 'https://maps.googleapis.com/maps/api/js';

		const url = () => {
				let url = URL;
				let params = {
						key: apiKey
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
