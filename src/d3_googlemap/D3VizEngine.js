import { getClass } from 'IzendaSynergy';

import { GOOGLEMAP_FIELD_MAPPING } from './../utils/CustomVizConstant';
import { ScriptCache } from './google_api_loader/ScriptCache';
import { GoogleApi } from './google_api_loader/GoogleApi';

import './styles.css';

const VizEngine = getClass('VizEngine');

const defaultCreateCache = () => {
	return ScriptCache({
		google: GoogleApi({
			apiKey: 'GOOGLE_API_KEY', // Please put your GOOGLE_API_KEY here
			version: 'v=3.34' //GOOGLE MAP API version
		})
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

			this.initGMap()
				.then(pos => {
					const map = new google
						.maps
						.Map(chartContainer, {
							zoom: 2,
							center: pos
						});

					const { type } = options;

					if (type && type.id === GOOGLEMAP_FIELD_MAPPING.POSTAL_CODE.id) {
						this.drawMapByGetGeoCode(chartContainer, options, map, onCompleted);
					} else {
						this.drawMapByLatLngs(chartContainer, options, map, onCompleted);
					}
				});
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

	drawMapByLatLngs(chartContainer, { data, fieldAlias, isShowTooltip }, map, fnCallback) {

		//create inforWindow
		const inforWindow = new google
			.maps
			.InfoWindow();

		//bind event on Map to close inforWindow
		google.maps.event.addListener(map, 'click', function () {
			inforWindow.close();
		});

		//attach callback function when the map loaded. convert canvas to image because of exporting issues.
		try {
			google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
				var canvasTags = document.querySelectorAll('canvas');
				var canvasLength = canvasTags.length;
				for (var i = 0; i < canvasLength; i++) {
					var imgTag = new Image();
					var imgData = canvasTags[i].toDataURL();
					imgTag.src = imgData;
					var parentTag = canvasTags[i].parentElement;
					parentTag.appendChild(imgTag);
					parentTag.removeChild(canvasTags[i]);
				}
				fnCallback && fnCallback();
			});
		} catch (error) {
			fnCallback && fnCallback();
		}

		// create new bounds
		const bounds = new google
			.maps
			.LatLngBounds();

		data.forEach((item, index) => {
			//define latitude and longitude
			const latLng = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };

			//extend bounds
			bounds.extend(latLng);

			//test for marker icon
			const markerIcon = this.getPinStyle(item);

			//add marker
			let marker = new google
				.maps
				.Marker({
					position: latLng,
					map: map,
					icon: markerIcon
				});

			//if this is the last item => add center map
			if (index === data.length - 1) {
				map.fitBounds(bounds);
				map.panToBounds(bounds);
			}
			//check for tooltip
			if (isShowTooltip) {
				google.maps.event.addListener(marker, 'click', ((marker, item) => {
					return () => {
						const inforHTML = `<div class="gmap-tooltip"><p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p></div>`;
						inforWindow.setContent(inforHTML);
						inforWindow.open(map, marker);
					};
				})(marker, item));
			}
		});
	}

	drawMapByGetGeoCode(chartContainer, { data, fieldAlias, isShowTooltip }, map, fnCallback) {

		//create inforWindow
		const inforWindow = new google
			.maps
			.InfoWindow();

		//bind event on Map to close inforWindow
		google.maps.event.addListener(map, 'click', function () {
			inforWindow.close();
		});

		//attach callback function when the map loaded. convert canvas to image because of exporting issues.
		try {
			google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
				var canvasTags = document.querySelectorAll('canvas');
				var canvasLength = canvasTags.length;
				for (var i = 0; i < canvasLength; i++) {
					var imgTag = new Image();
					var imgData = canvasTags[i].toDataURL();
					imgTag.src = imgData;
					var parentTag = canvasTags[i].parentElement;
					parentTag.appendChild(imgTag);
					parentTag.removeChild(canvasTags[i]);
				}
				fnCallback && fnCallback();
			});
		} catch (error) {
			fnCallback && fnCallback();
		}

		//google.maps.Geocoder constructor object
		const geoCoder = new google
			.maps
			.Geocoder();

		// create new bounds
		const bounds = new google
			.maps
			.LatLngBounds();

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
		data.forEach((item, index) => {
			getGeoCode(item).then(result => {
				if (result[0]) {
					//extend bounds
					bounds.extend(result[0].geometry.location);

					//get marker's icon
					const markerIcon = this.getPinStyle(item);

					//add marker
					let marker = new google
						.maps
						.Marker({
							position: result[0].geometry.location,
							map: map,
							icon: markerIcon
						});

					if (isShowTooltip) {
						//bind event to marker
						google.maps.event.addListener(marker, 'click', ((marker, item) => {
							return () => {
								const inforHTML = `<div class="gmap-tooltip"><p>${fieldAlias.geo}: ${item.postcode}</p><p>${fieldAlias.metric}: ${item.metricText}</p></div>`;
								inforWindow.setContent(inforHTML);
								inforWindow.open(map, marker);
							};
						})(marker, item));
					}

					//if this is the last item => add center map
					if (index === data.length - 1) {
						map.fitBounds(bounds);
						map.panToBounds(bounds);
					}
				}
			}).catch(error => {
				console.log(error);
			});
		});
	}

	getPinStyle(item) {
		const scaleMag = item.value * 10;
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: item.color || '#ff0000',
			fillOpacity: 0.3,
			scale: scaleMag,
			strokeColor: '#fff',
			strokeWeight: 0.5
		};
	}

	initGMap() {
		return new Promise((resolve, reject) => {
			const defaultLocate = {
				lat: 37.09024,
				lng: -95.712891
			};
			if (!!navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
				  (pos, status) => {
					const currLocate = {
					  lat: pos.coords.latitude,
					  lng: pos.coords.longitude
					};
					resolve(currLocate);
				  },
				  () => resolve(defaultLocate),
				  { timeout: 10000 }
				);
			  } else {
				resolve(defaultLocate);
			  }
		});
	}
}