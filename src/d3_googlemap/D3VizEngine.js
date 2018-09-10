import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import './assets/styles.css';
//import google map api helpers
import {ScriptCache} from './google_api_loader/ScriptCache';
import {GoogleApi} from './google_api_loader/GoogleApi';

const VizEngine = getClass('VizEngine');

export default class D3GoogleMapVizEngine extends VizEngine {
		initialize() {
				// Avoid race condition: remove previous 'load' listener
				if (this.unregisterLoadHandler) {
						this.unregisterLoadHandler();
						this.unregisterLoadHandler = null;
				} //build script and attact to
				window.this.scriptCache = defaultCreateCache();
				this.unregisterLoadHandler = this
						.scriptCache
						.google
						.onLoad(this.onLoad.bind(this));
		}
		onLoad(err, tag) {
				this._gapi = window.google;
		}

		async draw(chartContainer, chartType, options, onCompleted) {
				if (chartType === 'googlemap') {
						if (!window.google) {
								await
								this.initialize();
								return this.drawGoogleMap(chartContainer);
						}
						return this.drawGoogleMap(chartContainer);
				}
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
										});
								})
				}
		}
}
