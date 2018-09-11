import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import './assets/styles.css';
//import google map api helpers
import {ScriptCache} from './google_api_loader/ScriptCache';
import {GoogleApi} from './google_api_loader/GoogleApi';

const VizEngine = getClass('VizEngine');

const defaultCreateCache = () => {
		return ScriptCache({
				google: GoogleApi({apiKey: 'API_KEY'})
		});
};

export default class D3GoogleMapVizEngine extends VizEngine {
		constructor(...args) {
				super(...args);

				this.scriptCache = this.scriptCache
						? this.scriptCache
						: defaultCreateCache();
		}

		draw(chartContainer, chartType, options, onCompleted) {
				const drawGoogleMap = (chartContainer, options) => {
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
				};
				if (chartType === 'googlemap') {
						const onLoad = (err, tag) => {
								this._gapi = window.google;
								return drawGoogleMap(chartContainer, options);
						}
						if (!window.google) {
								return this
										.scriptCache
										.google
										.onLoad(onLoad);
						}
						return drawGoogleMap(chartContainer, options);
				}
		}
}