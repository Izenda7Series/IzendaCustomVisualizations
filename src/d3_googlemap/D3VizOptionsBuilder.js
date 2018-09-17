import {getClass} from 'IzendaSynergy';
import {helpers} from './../utils/D3TimelineHelper';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

//this const will be replaced to common
const FIELD_MAPPING = {
		COUNTRY: 'country',
		POSTAL_CODE: 'postalCode',
		LATITUDE: 'latitude',
		LONGTITUDE: 'longtitude'
};

export default class D3GoogleMapOptionsBuilder extends ChartOptionsBuilder {

		build() {
				const {chartData} = this;
				if (Array.isArray(chartData) && chartData.length === 0) 
						return {data: []};
				
				if (chartData.dataStructure.country) {
						return this.buildOptionByPostcode(this, FIELD_MAPPING.COUNTRY);
				} else if (chartData.dataStructure.postalCode) {
						return this.buildOptionByPostcode(this, FIELD_MAPPING.POSTAL_CODE);
				} else if (chartData.dataStructure.latitude && chartData.dataStructure.longtitude) {
						return this.buildOptionByLatLng(this);
				}

		}

		buildOptionByLatLng({chartData, fieldOptions}) {
				const latField = chartData.dataStructure.latitude[0];
				const longField = chartData.dataStructure.longtitude[0];
				const bbMetricField = chartData.dataStructure.bubbleMetrics[0];

				const bbMetricFieldOptions = fieldOptions[bbMetricField.fieldNameAlias];

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
												id: data.length,
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
						bbMetricOptions,
						type: 2 //lat/lng
				};

				return chartOptions;
		}

		buildOptionByPostcode({
				chartData,
				fieldOptions
		}, fieldMapping) {
				const geoField = chartData.dataStructure[fieldMapping][0];
				const bbMetricField = chartData.dataStructure.bubbleMetrics[0];

				const bbMetricFieldOptions = fieldOptions[bbMetricField.fieldNameAlias];

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
								const address = record[geoField.columnName];
								const value = record[bbMetricField.columnName];
								const percentValue = record[`percentage_${bbMetricField.columnName}`]
										? record[`percentage_${bbMetricField.columnName}`]
										: null;

								if (address && value > 0) {

										const color = (bbMetricFieldOptions.cellColors[fieldMapping] && helpers.getSettings(bbMetricFieldOptions.cellColors, 'latitude', value, percentValue)) || null;

										const metricAlterText = helpers.getSettings(bbMetricFieldOptions, 'alternativeText', value, percentValue);
										const metricText = metricAlterText !== value
												? metricAlterText
												: (!bbMetricOptions.fnFormat
														? value
														: helpers.formatData(bbMetricOptions.fnFormat, value, bbMetricOptions.dataType));

										const item = {
												id: data.length,
												address,
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
								geo: geoField.fieldNameAlias,
								metric: bbMetricField.fieldNameAlias
						},
						bbMetricOptions,
						type: fieldMapping
				};

				return chartOptions;
		}
}