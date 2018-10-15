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
		//create the geo cache for postcodes
		window._geoCache = window._geoCache
			? window._geoCache
			: new Map();
	}

	draw(chartContainer, chartType, options, onCompleted) {

		const drawGoogleMap = () => {
			const { type } = options;

			if (type && type.id === GOOGLEMAP_FIELD_MAPPING.POSTAL_CODE.id) {
				this.drawMapByGetGeoCode(chartContainer, options, onCompleted);
			} else {
				this.drawMapByLatLngs(chartContainer, options, onCompleted);
			}
		};

		if (chartType === 'googlemap') {
			if (!window.google) {

				const onLoad = (err, tag) => {
					this._gapi = window.google;
					return drawGoogleMap();
				};

				return this
					.scriptCache
					.google
					.onLoad(onLoad);
			}

			return drawGoogleMap();
		}
	}

	drawMapByLatLngs(chartContainer, { data, fieldAlias, isShowTooltip }, fnCallback) {

		const { map, bounds, inforWindow } = this.initialMap(chartContainer, data.length);
		let latLng, marker;

		//bind event on Map to close inforWindow
		google.maps.event.addListener(map, 'click', function () {
			inforWindow.close();
		});

		//attach callback function when the map loaded.
		google.maps.event.addListenerOnce(map, 'tilesloaded', fnCallback);

		data.forEach(item => {
			//define latitude and longitude
			latLng = new google
				.maps
				.LatLng(item.lat, item.lng);

			//define marker
			marker = new google
				.maps
				.Marker({
					position: latLng,
					map: map,
					icon: this.getPinStyle(item)
				});

			//extend bounds
			bounds.extend(latLng);

			if (isShowTooltip) {
				google.maps.event.addListener(marker, 'click', ((marker, item) => {
					return () => {
						const inforHTML = `<p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;
						inforWindow.setContent(inforHTML);
						inforWindow.open(map, marker);
					}
				})(marker, item));
			}
		});

		//center map
		if (data.length > 0) {
			map.fitBounds(bounds);
			//map.panToBounds(bounds);
		}
		fnCallback && fnCallback();
	}

	drawMapByGetGeoCode(chartContainer, { data, fieldAlias, isShowTooltip }, fnCallback) {
		const { map, bounds, inforWindow } = this.initialMap(chartContainer, data.length);

		//bind event on Map to close inforWindow
		google.maps.event.addListener(map, 'click', function () {
			inforWindow.close();
		});

		//attach callback function when the map loaded.
		google.maps.event.addListenerOnce(map, 'tilesloaded', fnCallback);

		//marker
		let marker;
		//google.maps.Geocoder constructor object
		const geoCoder = new google
			.maps
			.Geocoder();

		//Promise to get lat/lng by postcode
		const getGeoCode = (item) => {

			const { postcode } = item;

			return new Promise((resolve, reject) => {
				if (window._geoCache.has(postcode)) {
					resolve(window._geoCache.get(postcode));

				} else {
					geoCoder.geocode({
						address: postcode
					}, (result, status) => {
						if (status === google.maps.GeocoderStatus.OK) {
							window
								._geoCache
								.set(postcode, result);
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
		data.forEach(item => {

			getGeoCode(item).then(result => {
				if (result[0]) {
					//define marker
					marker = new google
						.maps
						.Marker({
							position: result[0].geometry.location,
							map: map,
							icon: this.getPinStyle(item)
						});

					//extend bounds
					bounds.extend(result[0].geometry.location);

					if (isShowTooltip) {
						//bind event to marker
						google.maps.event.addListener(marker, 'click', ((marker, item) => {
							return () => {
								const inforHTML = `<p>${fieldAlias.geo}: ${item.postcode}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;
								inforWindow.setContent(inforHTML);
								inforWindow.open(map, marker);
							}
						})(marker, item));
					}

					//if this is the last item => add center map
					if (item.id === data.length - 1) {
						map.fitBounds(bounds);
						//map.panToBounds(bounds);
					}
				}
			}).catch(error => {
				console.log(error);
			});
		});
	}

	getPinStyle(item) {
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: item.color || '#ff0000',
			fillOpacity: .3,
			scale: 15,
			//scale: Math.pow(2, item.value) / 2,
			strokeColor: '#fff',
			strokeWeight: .5
		};
	}

	initialMap(chartContainer, dataLength) {
		let pos = {
			lat: 37.09024,
			lng: -95.712891
		};

		const map = new google
			.maps
			.Map(chartContainer, {
				zoom: 2,
				center: pos
			});

		const bounds = new google
			.maps
			.LatLngBounds();

		const inforWindow = new google
			.maps
			.InfoWindow();

		dataLength === 0 && bounds.extend(new google.maps.LatLng(pos.lat, pos.lng));

		return { map, bounds, inforWindow };
	}

}