import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {DATA_TYPE, DEFAULT_COLORS} from './../d3_timeline/D3TimelineConstant';
import {helpers} from './../d3_timeline/D3TimelineHelper';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3GoogleMapOptionsBuilder extends ChartOptionsBuilder {
		build() {
				// const {chartData} = this; const latField = chartData.fieldMapping[0]; const
				// longField = chartData.fieldMapping[1]; const bbMetricField =
				// chartData.fieldMapping[2];

				let chartOptions = {
						data: [],
						options: {
								shaddingMetric: {},
								bubbleMetric: {}
						},
						fieldAlias: {
								// lat: latField.fieldNameAlias, long: longField.fieldNameAlias, metric:
								// bbMetricField.fieldNameAlias
						}
				};

				// let data = []; chartData 		.records 		.forEach(record => { 				const latVal =
				// record[latField.columnName]; 				const lngVal = record[longField.columnName];
				// 				if (latVal && longVal) { 						const item = { 								lat: latVal,
				// 								lng: lngVal, 								value: record[bbMetricField.columnName] 						};
				// 						data = [ 								...data, 								item 						]; 				} 		});
				// chartOptions.data = [ 		{ 				lat: '51.519703', 				lng: '-0.133027',
				// 				value: 1 		}, { 				lat: '57.14436', 				lng: '-2.107763', 				value: 4
				// 		} ];

				return chartOptions;
		}
}