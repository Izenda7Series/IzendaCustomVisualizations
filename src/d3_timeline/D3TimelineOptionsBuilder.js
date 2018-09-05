import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {DATA_TYPE, DEFAULT_COLORS} from './D3TimelineConstant';
import {helpers} from './D3TimelineHelper';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3TimelineOptionsBuilder extends ChartOptionsBuilder {
		build() {
				//get essential informations from response's JSON.
				const {chartData} = this;
				const groupField = chartData.dataStructure['separators'][0];
				const labelField = chartData.dataStructure['values'][0];
				const startField = chartData.dataStructure['startRange'][0];
				const endField = chartData.dataStructure['endRange'][0];
				const rangeDataType = startField.reportPartElm.properties.dataFormattings.functionInfo.dataType;
				const lanes = [...(new Set(chartData.records.map(record => record[groupField.columnName])))] || [];

				const startFieldOptions = this.fieldOptions[startField.fieldNameAlias];
				const groupOptions = {
						cellColors: this.fieldOptions[groupField.fieldNameAlias].cellColor,
						alternativeText: this.fieldOptions[groupField.fieldNameAlias].alternativeText,
						fieldDataType: this.fieldOptions[groupField.fieldNameAlias].fieldDataType,
						fieldFormatData: this.fieldOptions[groupField.fieldNameAlias].fieldFormatData
				};

				const metricOptions = {
						cellColors: this.fieldOptions[labelField.fieldNameAlias].cellColors,
						alternativeText: this.fieldOptions[labelField.fieldNameAlias].alternativeText,
						fieldDataType: this.fieldOptions[labelField.fieldNameAlias].fieldDataType,
						fieldFormatData: this.fieldOptions[labelField.fieldNameAlias].fieldFormatData
				};

				let items = [];
				chartData
						.records
						.forEach(record => {
								let item = {
										lane: lanes.indexOf(record[groupField.columnName]),
										id: record[labelField.columnName],
										start: record[startField.columnName],
										end: record[endField.columnName],
										laneName: record[groupField.columnName]
								};
								if (item.start && item.end) {
										items = [
												...items,
												item
										];
								}
								//get setting color for metric
								let itemInCellMetricColor = ((metricOptions.cellColors.value && metricOptions.cellColors.value.find(val => val.key === item.id)) || (metricOptions.cellColors.rangeValue && metricOptions.cellColors.rangeValue.find(val => val.from <= item.id && val.to >= item.id)));
								if (itemInCellMetricColor) {
										item.fillColor = itemInCellMetricColor.text;
								}
						});
				const parseData = (data, dataType) => {
						switch (dataType) {
								case DATA_TYPE.DATE:
										data.forEach((item) => {
												item.start = new Date(item.start);
												item.end = new Date(item.end);
										});
										break;

								case DATA_TYPE.NUMBER || DATA_TYPE.MONEY:
										data.forEach((item) => {
												item.start = parseFloat(item.start);
												item.end = parseFloat(item.end);
										});
										break;
								default:
										break;
						}
						return data;
				};

				items = parseData(items, rangeDataType);

				const metricFormat = helpers.getD3Format(metricOptions.fieldDataType, metricOptions.fieldFormatData);
				const rangeFormat = helpers.getD3Format(startFieldOptions.fieldDataType, startFieldOptions.fieldFormatData);

				let chartConfigs = {
						type: this.visualType,
						rangeDataType: startField.reportPartElm.properties.dataFormattings.functionInfo.dataType,
						data: {
								lanes,
								items
						},
						styles: {
								colors: this.chartOptions.colors || DEFAULT_COLORS,
								isShowTooltip: this.chartOptions.commonOptions.plotOptions.series.states.hover.enabled || true,
								plotBgColor: this.chartOptions.commonOptions.chart.plotBackgroundColor || 'none'
						},
						fieldNameAlias: {
								groupField: groupField.fieldNameAlias,
								labelField: labelField.fieldNameAlias,
								startField: startField.fieldNameAlias,
								endField: endField.fieldNameAlias
						},
						range: {},
						scales: {},
						formats: {
								metric: metricFormat,
								range: rangeFormat
						},
						fieldOptions: {
								groupOptions,
								metricOptions
						}
				};

				const {timelineBegin, timelineEnd} = helpers.getTimelineRange(items);
				chartConfigs.range = {
						timelineBegin,
						timelineEnd
				};

				//define scales
				const defineScales = (dataType) => {
						let scales = {
								y1: d3
										.scaleLinear()
										.domain([0, lanes.length]),
								y2: d3
										.scaleLinear()
										.domain([0, lanes.length])
						};

						switch (dataType) {
								case DATA_TYPE.DATE:
										scales.x = d3
												.scaleTime()
												.domain([timelineBegin, timelineEnd]);
										scales.x1 = d3
												.scaleTime()
												.domain([timelineBegin, timelineEnd]);
										scales.x2 = d3.scaleTime();
										break;

								case DATA_TYPE.NUMBER || DATA_TYPE.MONEY:
										scales.x = d3
												.scaleLinear()
												.domain([timelineBegin, timelineEnd]);
										scales.x1 = d3
												.scaleLinear()
												.domain([timelineBegin, timelineEnd]);
										scales.x2 = d3.scaleLinear();
										break;

								default:
										break;
						}
						return scales;
				};

				const scales = defineScales(rangeDataType);
				chartConfigs.scales = scales;

				return chartConfigs;
		}
}