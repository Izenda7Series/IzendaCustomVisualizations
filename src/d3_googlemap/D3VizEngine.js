import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import './assets/styles.css';
//import google map api helpers
import {ScriptCache} from './google_api_loader/ScriptCache';
import {GoogleApi} from './google_api_loader/GoogleApi';

const VizEngine = getClass('VizEngine');

export default class D3GoogleMapVizEngine extends VizEngine {
		draw(chartContainer, chartType, options, onCompleted) {
				if (chartType === 'googlemap') {
						if (!window.google) {
								this.initialize();
						}
						return this.drawGoogleMap(chartContainer);
				}
		}

		async initialize() {
				if (this.unregisterLoadHandler) {
						this.unregisterLoadHandler();
						this.unregisterLoadHandler = null;
				}

				const defaultCreateCache = () => {
						return ScriptCache({
								google: GoogleApi({apiKey: 'API_KEY'})
						});
				};

				this.scriptCache = defaultCreateCache();
				this.unregisterLoadHandler = await this
						.scriptCache
						.google
						.onLoad(this.onLoad.bind(this));
		}

		onLoad(err, tag) {
				this._gapi = window.google;
		}

		drawGoogleMap(chartContainer, options) {
				const data = [
						{
								lat: '51.519703',
								lng: '-0.133027',
								value: 1
						}, {
								lat: '57.14436',
								lng: '-2.107763',
								value: 4
						}
				];

				let map;
				if (navigator.geolocation) {
						navigator
								.geolocation
								.getCurrentPosition((position) => {
										let pos = {
												lat: position.coords.latitude,
												lng: position.coords.longitude
										};
										map = new google
												.maps
												.Map(chartContainer, {
														zoom: 1,
														center: pos
												});
										data.forEach(item => {
												let latLng = new google
														.maps
														.LatLng(item.lat, item.lng);
												let marker = new google
														.maps
														.Marker({position: latLng, map: map});
												let infowindow = new google
														.maps
														.InfoWindow({content: `Lat: ${item.lat}, Lng: ${item.lng}`});

												marker.addListener('click', function () {
														infowindow.open(map, marker);
												});
										});
								})
				}
		}
}
