import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import './assets/styles.css';
//import google map api helpers
import {ScriptCache} from './google_api_loader/ScriptCache';
import {GoogleApi} from './google_api_loader/GoogleApi';
import {helpers} from '../d3_timeline/D3TimelineHelper';

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
				const drawGoogleMap = (chartContainer, options) => {
						const {data, fieldAlias} = options;

						let map,
								bounds;

						//default center at Usa
						let pos = {
								lat: 37.09024,
								lng: -95.712891
						};

						const getPinStyle = (item) => {
								return {
										path: google.maps.SymbolPath.CIRCLE,
										fillColor: item.color || '#ff0000',
										fillOpacity: .5,
										scale: 15,
										strokeColor: '#fff',
										strokeWeight: .5
								};
						};

						map = new google
								.maps
								.Map(chartContainer, {
										zoom: 1,
										center: pos
								});

						bounds = new google
								.maps
								.LatLngBounds();

						data.length === 0 && bounds.extend(new google.maps.LatLng(pos.lat, pos.lng));

						data.length > 0 && data.forEach(item => {
								//define latitude and longitude
								let latLng = new google
										.maps
										.LatLng(item.lat, item.lng);
								//define marker
								let marker = new google
										.maps
										.Marker({position: latLng, map: map, icon: getPinStyle(item)});
								//extend bounds
								bounds.extend(latLng);
								//define an infor window (tooltip)
								const inforHTML = `<p>Lat: ${item.lat}</p><p>Lng : ${item.lng}</p><p>${fieldAlias.metric}: ${item.metricText}</p>`;

								let infowindow = new google
										.maps
										.InfoWindow({content: inforHTML});
								//add event for displaying tooltip
								marker.addListener('mouseover', function () {
										infowindow.open(map, marker);
								});
								marker.addListener('mouseout', function () {
										infowindow.close();
								});
						});
						//center map
						map.fitBounds(bounds);
						map.panToBounds(bounds);
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
}