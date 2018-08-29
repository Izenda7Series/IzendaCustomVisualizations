import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import {uniq, filter} from 'lodash';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

const DATA_TYPE = {
		'DATE': 'Datetime',
		'NUMBER': 'Number',
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

				const groupField = chartData.dataStructure['separators'][0];
				const labelField = chartData.dataStructure['values'][0];
				const startField = chartData.dataStructure['startRange'][0];
				const endField = chartData.dataStructure['endRange'][0];

				const lanes = uniq(chartData.records.map(record => record[groupField.columnName]));

				const items = filter(chartData.records.map(record => ({
						lane: lanes.indexOf(record[groupField.columnName]),
						id: record[labelField.columnName],
						start: record[startField.columnName],
						end: record[endField.columnName]
				})), record => record.start && record.end);

				//get field Alias to display in label
				const fieldNameAlias = {
						groupField: groupField.fieldNameAlias,
						labelField: labelField.fieldNameAlias,
						startField: startField.fieldNameAlias,
						endField: endField.fieldNameAlias
				};

				//@Linh: get format formulas - hardcode => should have a function for detecting
				const fieldFormats = {
						range: '%m/%d/%Y',
						metric: '.2f'
				};

				return {
						type: visualType,
						lanes,
						items,
						colors,
						fieldNameAlias,
						fieldFormats
				};

				// //get format of value const valFormat =
				// this.containers.values[0].properties.dataFormattings.format.format ||
				// '0,000.00'; const valFormatFormula = d3.format('.2f'); //@Linh: this is being
				// a hard code - should have a function for detecing format //get format of
				// start - end fields const format data const getFormatData = (data, type) => {
				// 	switch (type) { 		case DATA_TYPE.DATE: 			const utcParse =
				// d3.utcParse("%Y-%m-%dT%H:%M:%S"); 			data.forEach((item) => { 				item.start
				// = utcParse(item.start); 				item.end = utcParse(item.end); 				item.id =
				// valFormatFormula(item.id); 				item.laneName = lanes[item.lane]; 			});
				// 			break; 		case DATA_TYPE.MONEY: 			break; 		default: 			break; 	} };
		}
}