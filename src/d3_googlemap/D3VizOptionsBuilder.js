import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {DATA_TYPE, DEFAULT_COLORS} from './../d3_timeline/D3TimelineConstant';
import {helpers} from './../d3_timeline/D3TimelineHelper';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3GoogleMapOptionsBuilder extends ChartOptionsBuilder {
		build() {
				const {chartData} = this;
				if (Array.isArray(chartData) && chartData.length === 0) 
						return {data: []};
				
				const latField = chartData.dataStructure.latitude[0];
				const longField = chartData.dataStructure.longtitude[0];
				const bbMetricField = chartData.dataStructure.bubbleMetrics[0];

				const bbMetricFieldOptions = this.fieldOptions[bbMetricField.fieldNameAlias];

				//extract metric options
				const bbMetricOptions = {
						dataType: bbMetricFieldOptions.fieldDataType,
						fnFormat: helpers.getD3Format(bbMetricFieldOptions.fieldDataType, bbMetricFieldOptions.fieldFormatData)
				};

				//extract data from chartData
				let data = [];
				chartData
						.records
						.forEach((record, index) => {
								const lat = record[latField.columnName];
								const lng = record[longField.columnName];
								const value = record[bbMetricField.columnName];
								const percentValue = record[`percentage_${bbMetricField.columnName}`]
										? record[`percentage_${bbMetricField.columnName}`]
										: null;

								if (lat && lng && value > 0) {

										const color = (bbMetricFieldOptions.cellColors.latitude && helpers.getSettings(bbMetricFieldOptions.cellColors, 'latitude', value, percentValue)) || null;

										const metricAlterText = helpers.getSettings(bbMetricFieldOptions, 'alternativeText', value, percentValue);
										const metricText = metricAlterText !== value
												? metricAlterText
												: (!bbMetricOptions.fnFormat
														? value
														: helpers.formatData(bbMetricOptions.fnFormat, value, bbMetricOptions.dataType));

										const item = {
												id: index,
												lat,
												lng,
												value,
												color,
												metricText,
												percentValue
										};

										data = [
												...data,
												item
										];
								}

						});

				let chartOptions = {
						data,
						fieldAlias: {
								lat: latField.fieldNameAlias,
								long: longField.fieldNameAlias,
								metric: bbMetricField.fieldNameAlias
						},
						bbMetricOptions
				};

				return chartOptions;
		}
}