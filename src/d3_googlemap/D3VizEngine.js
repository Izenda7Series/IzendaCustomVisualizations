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

		//bind event on Map to close inforWindow
		google.maps.event.addListener(map, 'click', function () {
			inforWindow.close();
		});

		//attach callback function when the map loaded.
		google.maps.event.addListener(map, 'tilesloaded', fnCallback);

		data.forEach(item => {
			//define latitude and longitude
			const latLng = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };

			//test for marker icon
			const markerIcon = this.getPinStyle(item);
			// const markerIcon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
			//define marker
			let marker = new google
				.maps
				.Marker({
					position: latLng,
					icon: markerIcon,
					label: "Where are you?? My icon????"
				});

			//extend bounds
			bounds.extend(latLng);

			marker.setMap(map);

			if (isShowTooltip) {
				google.maps.event.addListener(marker, 'click', ((marker, item) => {
					return () => {
						const inforHTML = `<p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;
						inforWindow.setContent(inforHTML);
						inforWindow.open(map, marker);
					};
				})(marker, item));
			}
		});

		//center map
		if (data.length > 0) {
			map.fitBounds(bounds);
			//map.panToBounds(bounds);
		}
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
					//marker's icon
					const markerIcon = this.getPinStyle(item);
					//define marker
					marker = new google
						.maps
						.Marker({
							position: result[0].geometry.location,
							map: map,
							icon: markerIcon
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
							};
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
			strokeColor: '#fff',
			strokeWeight: .5
		};
	}

	initialMap(chartContainer, dataLength) {
		const USA = {
			lat: 37.09024,
			lng: -95.712891
		};

		const map = new google
			.maps
			.Map(chartContainer, {
				zoom: 2,
				center: USA
			});

		const bounds = new google
			.maps
			.LatLngBounds();

		const inforWindow = new google
			.maps
			.InfoWindow();

		dataLength === 0 && bounds.extend(new google.maps.LatLng(USA.lat, USA.lng));

		return { map, bounds, inforWindow };
	}

}