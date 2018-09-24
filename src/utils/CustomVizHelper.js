import * as d3 from 'd3';

import {DATA_TYPE, DATETIME_FORMAT, NUMERIC_FORMAT, MONTH_NAMES, DAYS_OF_WEEK} from './CustomVizConstant';

// This class is using for formatting data, calculate something. This class can
// be inherited by other charts.
class D3TimelineHelper {
		getFormatObject(dataType, formatString) {
				return dataType === DATA_TYPE.DATE
						? DATETIME_FORMAT.find(item => item.text === formatString)
						: NUMERIC_FORMAT.find(item => item.text === formatString);
		}
		/*
			@fn : getD3Format
      @scope: get D3's standard format.
			@params : dataType (datetime/numeric/money), format's string.
			@returns : d3.format function (if find) || format id (number) get from DATETIME_FORMAT
    */
		getD3Format(dataType, formatString) {
				// if (!formatString) 		return;
				if (!formatString && dataType === DATA_TYPE.DATE) 
						return d3.timeFormat('%m/%d/%Y');
				if (!formatString && dataType !== DATA_TYPE.DATE) 
						return;
				
				let fmFormula,
						fnFormat;
				if (dataType === DATA_TYPE.DATE) {
						if (formatString === 'Day' || formatString === 'Month') {
								fnFormat = (value) => {
										return `${value < 10
												? `0${value}`
												: `${value}`}`;
								};
						} else if (formatString === 'Year') {
								fnFormat = (value) => {
										return value;
								};
						} else if (formatString === 'Month Name') {
								fnFormat = (value) => {
										return MONTH_NAMES[value - 1];
								};
						} else if (formatString === 'Day of Week') {
								fnFormat = (value) => {
										return DAYS_OF_WEEK[value - 1];
								};
						} else if (formatString === 'Qtr') {
								fnFormat = (value) => {
										return `Q${value}`;
								};
						} else {
								fmFormula = DATETIME_FORMAT.find(item => item.text === formatString);
								fnFormat = fmFormula.format
										? d3.timeFormat(fmFormula.format)
										: fmFormula.id;
						}
				} else {
						fmFormula = NUMERIC_FORMAT.find(item => item.text === formatString);
						fnFormat = fmFormula.format
								? d3.format(fmFormula.format)
								: fmFormula.id;
				}
				return fnFormat;
		}
		/*
			@fn : formatData
			@scope : ormat data which are not supporting by d3js
			@params : fnFormat (d3.format), value, format type.
			@returns : value's string after formatting
    */
		formatData(fnFormat, val, formatType) {
				if (typeof(fnFormat) !== 'number') 
						return fnFormat(val);
				
				let result;
				if (formatType === DATA_TYPE.DATE) {
						switch (fnFormat) {
								case 18: //for yyyy - Qtr
										result = d3.timeFormat('%Y');
										return `${result(val)} - Q${this.getQuarterOfYear(val)}`;
										break;
								case 19: //for Qtr
										return `Q${this.getQuarterOfYear(val)}`;
										break;
								default:
						}
				} else {
						switch (fnFormat) {
								case 6: // for '$/100'
										return `$${val / 100}`;
										break;
								case 7: // for '0.00%'
										return `${val.toFixed(2)}%`;
										break;
								case 8: // for 0,000.00%
										const d3Formula = d3.format(',.2f');
										return `${d3Formula(val)}%`;
										break;
								case 9: //for 0000%
										return `${val}%`;
								case 10: //for '% of Group'
										return `${val}%`;
										break;
								case 11: // for '% of Group (with rounding)'
										return `${val}%`;
										break;
								case 12: // for '1K'
										result = d3.format(',.2f')(val / 1000);
										return `${result}K`;
										break;
								case 13: // for '1M'
										result = d3.format(',.2f')(val / 1000000);
										return `${result}M`;
										break;
								case 14: //for '1B'
										result = d3.format(',.2f')(val / 1000000000);
										return `${result}B`;
										break;
								default:
										break;
						}
				}
		}

		getPercentage(value, data, prop) {
				const sum = data.reduce((initialVal, curObj) => {
						return initialVal + curObj[prop];
				}, 0);
				return (value / sum) * 100;
		}

		getTimelineRange(data) {
				const startList = data.map(item => item.start),
						endList = data.map(item => item.end);
				const range = d3.extent(d3.merge([startList, endList]));
				return {timelineBegin: range[0], timelineEnd: range[1]};
		}

		getQuarterOfYear(date) {
				const month = date.getMonth() + 1;
				return Math.ceil(month / 3);
		}

		hasParseDate(objDateFormat) {
				return objDateFormat.id !== 11 && objDateFormat.id !== 12 && objDateFormat.id !== 13 && objDateFormat.id !== 14 && objDateFormat.id !== 15 && (objDateFormat.id <= 17 && objDateFormat.id >= 27);
		}

		// this function is using to get colors/ alternative texts from settings
		getSettings(options, prop, value, percentage = null) {
				let itemInOption = (options[prop].value && options[prop].value.find(val => val.key == value)) || (options[prop].rangeValue && options[prop].rangeValue.find(val => val.from <= value && val.to >= value)) || (options[prop].rangePercent && options[prop].rangePercent.find(val => val.from <= percentage && val.to >= percentage));
				return itemInOption
						? itemInOption.text
						: (prop === 'cellColors' || prop === 'latitude' || prop === 'postalCode'
								? ''
								: value);
		}
}

export const helpers = new D3TimelineHelper();