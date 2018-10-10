import { getClass } from 'IzendaSynergy';

import { GOOGLEMAP_FIELD_MAPPING } from './../utils/CustomVizConstant';
import { ScriptCache } from './google_api_loader/ScriptCache';
import { GoogleApi } from './google_api_loader/GoogleApi';

const VizEngine = getClass('VizEngine');

const defaultCreateCache = () => {
	return ScriptCache({
		google: GoogleApi({ apiKey: 'GOOGLE_API_KEY' })
	});
};

export default class D3GoogleMapVizEngine extends VizEngine {
	constructor(...args) {
		super(...args);

		//caching script for google map api
		this.scriptCache = this.scriptCache
			? this.scriptCache
			: defaultCreateCache();

		window._geoCache = window._geoCache
			? window._geoCache
			: new Map();
	}

	draw(chartContainer, chartType, options, onCompleted) {
		const drawGoogleMap = (chartContainer, options) => {
			const { data, fieldAlias, type, isShowTooltip } = options;

			if (type && type.id === GOOGLEMAP_FIELD_MAPPING.POSTAL_CODE.id) {
				return this.drawMapByGetGeoCode(chartContainer, data, fieldAlias, isShowTooltip);
			} else {
				return this.drawMapByLatLngs(chartContainer, data, fieldAlias, isShowTooltip);
			}
		};

		if (chartType === 'googlemap') {
			const onLoad = (err, tag) => {
				this._gapi = window.google;
				return drawGoogleMap(chartContainer, options);
			};

			if (!window.google) {
				return this
					.scriptCache
					.google
					.onLoad(onLoad);
			}
			return drawGoogleMap(chartContainer, options);
		}
	}

	drawMapByLatLngs(chartContainer, data, fieldAlias, isShowTooltip) {
		const { map, bounds } = this.initialMap(chartContainer, data);

		data.forEach(item => {
			//define latitude and longitude
			let latLng = new google
				.maps
				.LatLng(item.lat, item.lng);

			//define marker
			let marker = new google
				.maps
				.Marker({
					position: latLng,
					map: map,
					icon: this.getPinStyle(item)
				});

			//extend bounds
			bounds.extend(latLng);

			if (isShowTooltip) {
				//define an infor window (tooltip)
				const inforHTML = `<p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;

				let infowindow = new google
					.maps
					.InfoWindow({ content: inforHTML });

				//add event for displaying tooltip
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
			}
		});

		//center map
		if (data.length > 0) {
			map.fitBounds(bounds);
			map.panToBounds(bounds);
		}
	}

	drawMapByGetGeoCode(chartContainer, data, fieldAlias, isShowTooltip) {
		const { map, bounds } = this.initialMap(chartContainer, data);

		//google.maps.Geocoder constructor object
		const geoCoder = new google
			.maps
			.Geocoder();

		//Promise to get lat/lng by postcode
		const getGeoCode = (item) => {
			let val = item.postcode,
				params = {
					'postalCode': val
				};

			return new Promise((resolve, reject) => {
				if (window._geoCache.has(val)) {
					resolve(window._geoCache.get(val));
				} else {
					geoCoder.geocode({
						address: val
					}, (result, status) => {
						if (status === google.maps.GeocoderStatus.OK) {
							window
								._geoCache
								.set(val, result);
							resolve(result);
						} else {
							if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
								setTimeout(function () {
									getGeoCode(item);
								}, 2000);
							} else {
								reject(status);
							}
						}
					});
				}
			});
		};

		//render marker by data
		data.forEach((item, index) => {
			const renderItem = (item) => {
				getGeoCode(item).then((result) => {
					if (result[0]) {
						//define marker
						let marker = new google
							.maps
							.Marker({
								position: result[0].geometry.location,
								map: map,
								icon: this.getPinStyle(item)
							});

						//extend bounds
						bounds.extend(result[0].geometry.location);

						if (isShowTooltip) {
							//define an infor window (tooltip)
							const buildHTMLContent = () => {
								return `<p>${fieldAlias.geo}: ${item.postcode}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;
							};

							let infowindow = new google
								.maps
								.InfoWindow({ content: buildHTMLContent() });

							//add event for displaying tooltip
							marker.addListener('click', function () {
								infowindow.open(map, marker);
							});
						}

						//if this is the last item => add center map
						if (item.id === data.length - 1) {
							map.fitBounds(bounds);
							map.panToBounds(bounds);
						}
					}

				}).catch(error => {
					console.log(error);
				});
			};

			renderItem(item);
		});
	}

	getPinStyle(item) {
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: item.color || '#ff0000',
			fillOpacity: .5,
			scale: 15,
			strokeColor: '#fff',
			strokeWeight: .5
		};
	}

	initialMap(chartContainer, data) {
		let pos = {
			lat: 37.09024,
			lng: -95.712891
		};

		const map = new google
			.maps
			.Map(chartContainer, {
				zoom: 1,
				center: pos
			});

		const bounds = new google
			.maps
			.LatLngBounds();

		data.length === 0 && bounds.extend(new google.maps.LatLng(pos.lat, pos.lng));
		return { map, bounds };
	}

}