import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {uniq, filter} from 'lodash';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

const DATA_TYPE = {
		'DATE': 'Datetime',
		'NUMBER': 'Numeric',
		'MONEY': 'Money'
};

export default class D3TimelineOptionsBuilder extends ChartOptionsBuilder {
		constructor(...args) {
				super(...args);
		}

		build() {
				const {visualType, chartOptions: {
								colors
						}, chartData, fieldOptions, chartContainer} = this;
				const isShowTooltip = this.chartOptions.commonOptions.plotOptions.series.states.hover.enabled;
				const plotBgColor = this.chartOptions.commonOptions.chart.plotBackgroundColor || 'none';
				const entireChartBgColor = "#FFF";
				const groupField = chartData.dataStructure['separators'][0];
				const labelField = chartData.dataStructure['values'][0];
				const startField = chartData.dataStructure['startRange'][0];
				const endField = chartData.dataStructure['endRange'][0];

				const lanes = uniq(chartData.records.map(record => record[groupField.columnName]));

				//get field Alias to display in label
				const fieldNameAlias = {
						groupField: groupField.fieldNameAlias,
						labelField: labelField.fieldNameAlias,
						startField: startField.fieldNameAlias,
						endField: endField.fieldNameAlias
				};

				let items = filter(chartData.records.map(record => ({
						lane: lanes.indexOf(record[groupField.columnName]),
						id: record[labelField.columnName],
						start: record[startField.columnName],
						end: record[endField.columnName]
				})), record => record.start && record.end);

				const rangeDataType = startField.reportPartElm.properties.dataFormattings.functionInfo.dataType;
				//parse data follow field formats.
				const parseData = (data, dataType) => {
						switch (dataType) {
								case DATA_TYPE.DATE:
										const utcParse = d3.utcParse("%Y-%m-%dT%H:%M:%S");
										data.forEach((item) => {
												item.start = utcParse(item.start);
												item.end = utcParse(item.end);
												item.id = parseFloat(item.id);
												item.laneName = lanes[item.lane];
										});
										break;
								case DATA_TYPE.MONEY:
										data.forEach((item) => {
												item.start = utcParse(item.start);
												item.end = utcParse(item.end);
												item.id = parseFloat(item.id);
												item.laneName = lanes[item.lane];
										});
										break;
								case DATA_TYPE.NUMBER:
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

				//get ranges for extent
				const getTimeRange = (data) => {
						const startList = data.map(item => item.start),
								endList = data.map(item => item.end);
						const range = d3.extent(d3.merge([startList, endList]));
						return {timeBegin: range[0], timeEnd: range[1]};
				};

				const {timeBegin, timeEnd} = getTimeRange(items);

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
				return {
						type: visualType,
						lanes,
						items,
						colors,
						fieldNameAlias,
						fieldFormats,
						timeBegin,
						timeEnd,
						scales,
						plotBgColor,
						entireChartBgColor,
						isShowTooltip
				};
		}
}