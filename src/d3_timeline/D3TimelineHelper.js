import * as d3 from 'd3';

import {DATA_TYPE, DATETIME_FORMAT, NUMERIC_FORMAT} from './D3TimelineConstant';

class D3TimelineHelper {
		getD3Format(dataType, formatString) {
				// if (!formatString) 		return;
				if (!formatString && dataType === DATA_TYPE.DATE) 
						return d3.timeFormat('%m/%d/%Y');
				if (!formatString && dataType !== DATA_TYPE.DATE) 
						return;
				
				let fmFormula,
						copyFormula = {},
						fnFormat;
				if (dataType === DATA_TYPE.DATE) {
						fmFormula = DATETIME_FORMAT.find(item => item.text === formatString);
						if (fmFormula.id === 18) { //check for quarter
								let quarter = 2;
								fmFormula.format = `${fmFormula.format} ${quarter}`;
						}
						fnFormat = d3.timeFormat(fmFormula.format);
				} else {
						fmFormula = NUMERIC_FORMAT.find(item => item.text === formatString);
						fnFormat = d3.format(fmFormula.format);
				}
				return fnFormat;
		}
		getPercentage(value, data, prop) {
				const sum = data.reduce((preObj, curObj) => {
						return preObj[prop] + curObj[prop];
				});
				return (value / sum) * 100;
		}
		getTimelineRange(data) {
				const startList = data.map(item => item.start),
						endList = data.map(item => item.end);
				const range = d3.extent(d3.merge([startList, endList]));
				return {timelineBegin: range[0], timelineEnd: range[1]};
		};

}

export const helpers = new D3TimelineHelper();