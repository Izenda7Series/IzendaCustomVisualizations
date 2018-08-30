import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {DATA_TYPE, DEFAULT_COLORS} from './D3TimelineHelper';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3TimelineOptionsBuilder extends ChartOptionsBuilder {
		constructor(...args) { //@Linh: don't need to use this constructor method. because this is default for derived class.
				super(...args);
		}

		build() {
				//get essential informations from response's JSON.
				const {chartData} = this;
				const groupField = chartData.dataStructure['separators'][0];
				const labelField = chartData.dataStructure['values'][0];
				const startField = chartData.dataStructure['startRange'][0];
				const endField = chartData.dataStructure['endRange'][0];
				const rangeDataType = startField.reportPartElm.properties.dataFormattings.functionInfo.dataType;
				const lanes = [...(new Set(chartData.records.map(record => record[groupField.columnName])))] || [];

				let items = [];
				chartData
						.records
						.forEach(record => {
								let item = {
										lane: lanes.indexOf(record[groupField.columnName]),
										id: record[labelField.columnName],
										start: record[startField.columnName],
										end: record[endField.columnName]
								};
								if (item.start && item.end) {
										items = [
												...items,
												item
										];
								}
						});
				const parseData = (data, dataType) => {
						switch (dataType) {
								case DATA_TYPE.DATE:
										data.forEach((item) => {
												item.start = new Date(item.start);
												item.end = new Date(item.end);
												item.id = parseFloat(item.id);
												item.laneName = lanes[item.lane];
										});
										break;

								case DATA_TYPE.NUMBER || DATA_TYPE.MONEY:
										data.forEach((item) => {
												item.start = parseFloat(item.start);
												item.end = parseFloat(item.end);
												item.id = parseFloat(item.id);
												item.laneName = lanes[item.lane];
										});
										break;
								default:
										break;
						}
						return data;
				};

				items = parseData(items, rangeDataType);

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
						scales: {}
				};

				//@Linh: get format formulas - hardcode => should have a function for detecting
				const getFieldFormats = (dataType) => {
						let fieldFormats = {};
						switch (dataType) {
								case DATA_TYPE.DATE:
										fieldFormats.startEndRange = d3.timeFormat('%m-%d-%Y');
										fieldFormats.metric = d3.format('.2f');
										break;
								case DATA_TYPE.NUMBER:
										fieldFormats.startEndRange = d3.format('.2f');
										fieldFormats.metric = d3.format('.2f');
										break;
								case DATA_TYPE.MONEY:
										fieldFormats.startEndRange = d3.format('$.2f');
										fieldFormats.metric = d3.format('.2f');
										break;
								default:
										break;
						}
						return fieldFormats;
				};
				const fieldFormats = getFieldFormats(rangeDataType);
				chartConfigs.fieldFormats = fieldFormats;

				//get ranges for extent
				const getTimeRange = (data) => {
						const startList = data.map(item => item.start),
								endList = data.map(item => item.end);
						const range = d3.extent(d3.merge([startList, endList]));
						return {timeBegin: range[0], timeEnd: range[1]};
				};

				const {timeBegin, timeEnd} = getTimeRange(items);
				chartConfigs.range = {
						timeBegin,
						timeEnd
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
												.domain([timeBegin, timeEnd]);
										scales.x1 = d3
												.scaleTime()
												.domain([timeBegin, timeEnd]);
										scales.x2 = d3.scaleTime();
										break;

								case DATA_TYPE.NUMBER || DATA_TYPE.MONEY:
										scales.x = d3
												.scaleLinear()
												.domain([timeBegin, timeEnd]);
										scales.x1 = d3
												.scaleLinear()
												.domain([timeBegin, timeEnd]);
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