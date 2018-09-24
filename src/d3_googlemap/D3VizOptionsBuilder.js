import {getClass} from 'IzendaSynergy';
import {helpers} from '../utils/CustomVizHelper';
import {GOOGLEMAP_FIELD_MAPPING} from './../utils/CustomVizConstant';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3GoogleMapOptionsBuilder extends ChartOptionsBuilder {

		build() {
				const {chartData, fieldOptions} = this;
				if (Array.isArray(chartData) && chartData.length === 0) 
						return {data: []};
				if (chartData.dataStructure.postalCode) {
						return this.buildOptionByPostcode(chartData, fieldOptions);
				} else {
						return this.buildOptionByLatLng(chartData, fieldOptions);
				}
		}

		buildOptionByLatLng(chartData, fieldOptions) {
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
						isShowTooltip: this.chartOptions.optionByType.izShowTooltip,
						type: GOOGLEMAP_FIELD_MAPPING.LAT_LNG
				};

				return chartOptions;
		}

		buildOptionByPostcode(chartData, fieldOptions) {

				const postCodeField = chartData.dataStructure.postalCode[0];
				const bbMetricField = chartData.dataStructure.bubbleMetrics[0];
				const bbMetricFieldOptions = fieldOptions[bbMetricField.fieldNameAlias];

				//extract metric options
				const bbMetricOptions = {
						dataType: bbMetricFieldOptions.fieldDataType,
						fnFormat: helpers.getD3Format(bbMetricFieldOptions.fieldDataType, bbMetricFieldOptions.fieldFormatData)
				};

				// extract data from chartData
				let data = [];
				chartData
						.records
						.forEach((record, index) => {
								const postcode = record[postCodeField.columnName];
								const value = record[bbMetricField.columnName];
								const percentValue = record[`percentage_${bbMetricField.columnName}`]
										? record[`percentage_${bbMetricField.columnName}`]
										: null;
								if (postcode && value > 0) {
										const color = (bbMetricFieldOptions.cellColors.postalCode && helpers.getSettings(bbMetricFieldOptions.cellColors, 'postalCode', value, percentValue)) || null;
										const metricAlterText = helpers.getSettings(bbMetricFieldOptions, 'alternativeText', value, percentValue);
										const metricText = metricAlterText !== value
												? metricAlterText
												: (!bbMetricOptions.fnFormat
														? value
														: helpers.formatData(bbMetricOptions.fnFormat, value, bbMetricOptions.dataType));
										const item = {
												id: data.length,
												postcode,
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
								geo: postCodeField.fieldNameAlias,
								metric: bbMetricField.fieldNameAlias
						},
						isShowTooltip: this.chartOptions.optionByType.izShowTooltip,
						bbMetricOptions,
						type: GOOGLEMAP_FIELD_MAPPING.POSTAL_CODE
				};

				return chartOptions;
		}
}