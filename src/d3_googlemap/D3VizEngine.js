import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import './assets/styles.css';
//import google map api helpers
import {ScriptCache} from './google_api_loader/ScriptCache';
import {GoogleApi} from './google_api_loader/GoogleApi';

//this const will be replaced to common
const FIELD_MAPPING = {
		COUNTRY: 'country',
		POSTAL_CODE: 'postalCode',
		LATITUDE: 'latitude',
		LONGTITUDE: 'longtitude'
};

const VizEngine = getClass('VizEngine');

const defaultCreateCache = () => {
		return ScriptCache({
				google: GoogleApi({apiKey: 'AIzaSyCztGOnG7cbR5FUZtAN-CEuHnzWS08wLec'})
		});
};

export default class D3GoogleMapVizEngine extends VizEngine {
		constructor(...args) {
				super(...args);

				//caching script for google map api
				this.scriptCache = this.scriptCache
						? this.scriptCache
						: defaultCreateCache();
		}

		draw(chartContainer, chartType, options, onCompleted) {

				//detect type of received data : lat/lng or postcode/address

				const drawGoogleMap = (chartContainer, options) => {
						const {data, fieldAlias, type} = options;

						if (type === FIELD_MAPPING.COUNTRY || type === FIELD_MAPPING.POSTAL_CODE) {
								return this.drawMapByPostcode(chartContainer, data, fieldAlias, type);
						} else {
								return this.drawMapByLatLngs(chartContainer, data, fieldAlias);
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

		drawMapByLatLngs(chartContainer, data, fieldAlias) {
				const {map, bounds} = this.initialMap(chartContainer, data);

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

						//define an infor window (tooltip)
						const inforHTML = `<p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;

						let infowindow = new google
								.maps
								.InfoWindow({content: inforHTML});

						//add event for displaying tooltip
						marker.addListener('click', function () {
								infowindow.open(map, marker);
						});
						// marker.addListener('mouseout', function () { 		infowindow.close(); });
				});

				//center map
				if (data.length > 0) {
						map.fitBounds(bounds);
						map.panToBounds(bounds);
				}
		}

		drawMapByPostcode(chartContainer, data, fieldAlias, type) {
				const {map, bounds} = this.initialMap(chartContainer, data);

				//google.maps.Geocoder constructor object
				const geoCoder = new google
						.maps
						.Geocoder();

				//Promise to get lat/lng by postcode
				const getGeoCode = (value) => {
						return new Promise((resolve, reject) => {
								const params = (type === FIELD_MAPPING.POSTAL_CODE)
										? {
												postalCode: value
										}
										: {
												country: value
										};
								geoCoder.geocode({
										componentRestrictions: params
								}, (results, status) => {
										if (status === 'OK') {
												resolve(results);
										} else {
												reject(status);
										}
								});
						});
				};

				//render marker by data
				data.forEach((item, index) => {
						getGeoCode(item.address).then((result) => {
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

										//define an infor window (tooltip)
										const inforHTML = `<p>${fieldAlias.geo}: ${item.address}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;

										let infowindow = new google
												.maps
												.InfoWindow({content: inforHTML});

										//add event for displaying tooltip
										marker.addListener('click', function () {
												infowindow.open(map, marker);
										});

										//if this is the last item => add center map
										if (item.id === data.length - 1) {
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
				return {map, bounds};
		}

}