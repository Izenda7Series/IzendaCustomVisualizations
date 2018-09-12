import {REPORT_PART_TYPES, registerVisualizationEngine, extendReportPartStyleConfiguration, createFieldContainerSchema} from 'IzendaSynergy';
import D3GoogleMapVizEngine from './D3VizEngine';
import D3GoogleMapOptionsBuilder from './D3VizOptionsBuilder';

registerVisualizationEngine('GoogleMap', D3GoogleMapVizEngine);

/**
 * Extend the chart visualization by specifying
 *  - Report part type to extend: REPORT_PART_TYPES.Chart
* 	- Style name : 'GoogleMap'
 *  - Base style to extend: CHART_STYLES.GoogleMap
 *  - The GoogleMap configuration
 */
extendReportPartStyleConfiguration(REPORT_PART_TYPES.Map, 'GoogleMap', null, {
		/**
   * Visual type to identify which D3 type to be rendered
   */
		visualType: 'googlemap',

		/**
   * The label text shows in chart type dropdown
   */
		visualLabel: 'Google Map',

		visualEngine: 'GoogleMap',

		/**
   * Declare Z-Axis Values field container
   */
		fieldContainerSchema: [
				createFieldContainerSchema('Country', 'Country', 'country', null, 1),
				createFieldContainerSchema('State/Province', 'State/Province', 'state', null, 1),
				createFieldContainerSchema('County', 'County', 'county', null, 1),
				createFieldContainerSchema('City', 'City', 'city', null, 1),
				createFieldContainerSchema('Postal Code', 'Postal Code', 'postalCode', null, 1),
				createFieldContainerSchema('Latitude', 'Latitude', 'latitude', null, 1),
				createFieldContainerSchema('Longitude', 'Longtitude', 'longtitude', null, 1),
				createFieldContainerSchema('Bubble Metric', 'Bubble Metric', 'bubbleMetrics', null, 1, true)
		],

		/**
   * Define which options builder class is using for this chart type
   */
		optionsBuilder: D3GoogleMapOptionsBuilder
});
