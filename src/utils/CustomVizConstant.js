export const DATA_TYPE = {
		'DATE': 'Datetime',
		'NUMBER': 'Numeric',
		'MONEY': 'Money'
};

export const DEFAULT_COLORS = [
		'#7cb5ec',
		'#434348',
		'#90ed7d',
		'#f7a35c',
		'#8085e9',
		'#f15c80',
		'#e4d354',
		'#2b908f',
		'#f45b5b',
		'#91e8e1'
];

export const MONTH_NAMES = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
];

export const DAYS_OF_WEEK = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
];

export const DATETIME_FORMAT = [
		{
				id: 0,
				text: 'MM/dd/yyyy',
				format: '%m/%d/%Y'
		}, {
				id: 1,
				text: 'M/d/yyyy',
				format: '%-m/%-d/%Y'
		}, {
				id: 2,
				text: 'MM/dd/yy',
				format: '%m/%d/%y'
		}, {
				id: 3,
				text: 'M/d/yy',
				format: '%-m/%-d/%y'
		}, {
				id: 4,
				text: 'MM-yy',
				format: '%m-%y'
		}, {
				id: 5,
				text: 'M-yy',
				format: '%-m-%y'
		}, {
				id: 6,
				text: 'MM-yyyy',
				format: '%m-%Y'
		}, {
				id: 7,
				text: 'M-yyyy',
				format: '%-m-%Y'
		}, {
				id: 8,
				text: '[Month Name]-yy',
				format: '%B-%y'
		}, {
				id: 9,
				text: '[Month Name]-yyyy',
				format: '%B-%Y'
		}, {
				id: 10,
				text: '[Day Names of the Week], [Month Name] dd, yyyy',
				format: '%A, %B %d, %Y'
		}, {
				id: 10,
				text: '[Day Names of the Week], [Month Name] d, yyyy',
				format: '%A, %B %-d, %Y'
		}, {
				id: 11,
				text: 'Day',
				format: '%d'
		}, {
				id: 12,
				text: 'Month',
				format: '%m'
		}, {
				id: 13,
				text: 'Year',
				format: '%Y'
		}, {
				id: 14,
				text: 'Month Name',
				format: '%B'
		}, {
				id: 15,
				text: 'Day of Week',
				format: '%A'
		}, {
				id: 16,
				text: 'Date',
				format: '%x'
		}, {
				id: 17,
				text: 'Week Number',
				format: 'Week %U - %Y'
		}, {
				id: 18,
				text: 'yyyy - Qtr',
				format: ''
		}, {
				id: 19,
				text: 'Qtr',
				format: ''
		}, {
				id: 20,
				text: 'HH:mm tt (12-hour time)',
				format: '%I:%M %p'
		}, {
				id: 21,
				text: 'H:mm tt (12-hour time)',
				format: '%-I:%M %p'
		}, {
				id: 22,
				text: 'HH:mm (24-hour time)',
				format: '%H:%M'
		}, {
				id: 23,
				text: 'H:mm (24-hour time)',
				format: '%-H:%M'
		}, {
				id: 24,
				text: 'HH:mm:ss tt',
				format: '%I:%M:%S %p'
		}, {
				id: 25,
				text: 'H:mm:ss tt',
				format: '%-I:%M:%S %p'
		}, {
				id: 26,
				text: 'HH:mm:ss',
				format: '%I:%M:%S'
		}, {
				id: 27,
				text: 'H:mm:ss',
				format: '%-H:%M:%S'
		}, {
				id: 28,
				text: 'MM/dd/yyyy HH:mm:ss tt',
				format: '%m/%d/%Y %I:%M:%S %p'
		}, {
				id: 29,
				text: 'M/d/yyyy HH:mm:ss tt',
				format: '%-m/%-d/%Y %I:%M:%S %p'
		}, {
				id: 30,
				text: 'MM/dd/yy HH:mm:ss tt',
				format: '%m/%d/%y %I:%M:%S %p'
		}, {
				id: 31,
				text: 'M/d/yy HH:mm:ss tt',
				format: '%-m/%-d/%y %I:%M:%S %p'
		}, {
				id: 32,
				text: 'MM-yy HH:mm:ss tt',
				format: '%m-%y %I:%M:%S %p'
		}, {
				id: 33,
				text: 'M-yy HH:mm:ss tt',
				format: '%-m-%y %I:%M:%S %p'
		}, {
				id: 34,
				text: 'MM-yyyy HH:mm:ss tt',
				format: '%m-%Y %I:%M:%S %p'
		}, {
				id: 35,
				text: 'M-yyyy HH:mm:ss tt',
				format: '%-m-%Y %I:%M:%S %p'
		}, {
				id: 36,
				text: 'MM/dd/yyyy HH:mm:ss',
				format: '%m/%d/%Y %H:%M:%S'
		}, {
				id: 37,
				text: 'M/d/yyyy HH:mm:ss',
				format: '%-m/%-d/%Y %H:%M:%S'
		}, {
				id: 38,
				text: 'MM/dd/yy HH:mm:ss',
				format: '%m/%d/%y %H:%M:%S'
		}, {
				id: 39,
				text: 'M/d/yy HH:mm:ss',
				format: '%-m/%-d/%y %H:%M:%S'
		}, {
				id: 40,
				text: 'MM-yy HH:mm:ss',
				format: '%m-%y %H:%M:%S'
		}, {
				id: 41,
				text: 'M-yy HH:mm:ss',
				format: '%-m-%y %H:%M:%S'
		}, {
				id: 42,
				text: 'MM-yyyy HH:mm:ss',
				format: '%m-%Y %H:%M:%S'
		}, {
				id: 43,
				text: 'M-yyyy HH:mm:ss',
				format: '%-m-%Y %H:%M:%S'
		}, {
				id: 44,
				text: 'yy-MM HH:mm:ss',
				format: '%Y-%m %H:%M:%S'
		}, {
				id: 45,
				text: 'yy-M HH:mm:ss',
				format: '%Y-%-m %H:%M:%S'
		}, {
				id: 46,
				text: '[Month Name]-yy HH:mm:ss tt',
				format: '%B-%y %I:%M:%S %p'
		}, {
				id: 47,
				text: '[Month Name]-yyyy HH:mm:ss tt',
				format: '%B-%Y %I:%M:%S %p'
		}, {
				id: 48,
				text: '[Day Names of the Week], [Month Name] dd, yyyy HH:mm:ss tt',
				format: '%A, %B %d, %Y %I:%M:%S %p'
		}, {
				id: 49,
				text: '[Day Names of the Week], [Month Name] d, yyyy HH:mm:ss tt',
				format: '%A, %B %-d, %Y %I:%M:%S %p'
		}, {
				id: 50,
				text: '[Month Name]-yy HH:mm:ss',
				format: '%B-%y %H:%M:%S'
		}, {
				id: 51,
				text: '[Month Name]-yyyy HH:mm:ss',
				format: '%B-%Y %H:%M:%S'
		}, {
				id: 52,
				text: '[Day Names of the Week], [Month Name] dd, yyyy HH:mm:ss',
				format: '%A, %B %d, %Y %H:%M:%S'
		}, {
				id: 53,
				text: '[Day Names of the Week], [Month Name] d, yyyy HH:mm:ss',
				format: '%A, %B %-d, %Y %H:%M:%S'
		}
];

export const MOMENT_DATETIME_FORMAT = [
		{
				id: 0,
				text: 'yyyy - Qtr',
				format: 'YYYY-Q'
		}, {
				id: 1,
				text: 'HH:mm tt (12-hour time)',
				format: 'HH:mm:ss'
		}, {
				id: 2,
				text: 'H:mm tt (12-hour time)',
				format: 'HH:mm:ss'
		}, {
				id: 3,
				text: 'HH:mm (24-hour time)',
				format: 'HH:mm:ss'
		}, {
				id: 4,
				text: 'H:mm (24-hour time)',
				format: 'HH:mm:ss'
		}, {
				id: 5,
				text: 'HH:mm:ss tt',
				format: 'HH:mm:ss'
		}, {
				id: 6,
				text: 'H:mm:ss tt',
				format: 'HH:mm:ss'
		}, {
				id: 7,
				text: 'HH:mm:ss',
				format: 'HH:mm:ss'
		}, {
				id: 8,
				text: 'H:mm:ss',
				format: 'HH:mm:ss'
		}, {
				id: 9,
				text: 'MM/dd/yyyy HH:mm:ss tt',
				format: '%m/%d/%Y %I:%M:%S %p'
		}, {
				id: 10,
				text: 'M/d/yyyy HH:mm:ss tt',
				format: '%-m/%-d/%Y %I:%M:%S %p'
		}, {
				id: 30,
				text: 'MM/dd/yy HH:mm:ss tt',
				format: '%m/%d/%y %I:%M:%S %p'
		}, {
				id: 31,
				text: 'M/d/yy HH:mm:ss tt',
				format: '%-m/%-d/%y %I:%M:%S %p'
		}, {
				id: 32,
				text: 'MM-yy HH:mm:ss tt',
				format: '%m-%y %I:%M:%S %p'
		}, {
				id: 33,
				text: 'M-yy HH:mm:ss tt',
				format: '%-m-%y %I:%M:%S %p'
		}, {
				id: 34,
				text: 'MM-yyyy HH:mm:ss tt',
				format: '%m-%Y %I:%M:%S %p'
		}, {
				id: 35,
				text: 'M-yyyy HH:mm:ss tt',
				format: '%-m-%Y %I:%M:%S %p'
		}, {
				id: 36,
				text: 'MM/dd/yyyy HH:mm:ss',
				format: '%m/%d/%Y %H:%M:%S'
		}, {
				id: 37,
				text: 'M/d/yyyy HH:mm:ss',
				format: '%-m/%-d/%Y %H:%M:%S'
		}, {
				id: 38,
				text: 'MM/dd/yy HH:mm:ss',
				format: '%m/%d/%y %H:%M:%S'
		}, {
				id: 39,
				text: 'M/d/yy HH:mm:ss',
				format: '%-m/%-d/%y %H:%M:%S'
		}, {
				id: 40,
				text: 'MM-yy HH:mm:ss',
				format: '%m-%y %H:%M:%S'
		}, {
				id: 41,
				text: 'M-yy HH:mm:ss',
				format: '%-m-%y %H:%M:%S'
		}, {
				id: 42,
				text: 'MM-yyyy HH:mm:ss',
				format: '%m-%Y %H:%M:%S'
		}, {
				id: 43,
				text: 'M-yyyy HH:mm:ss',
				format: '%-m-%Y %H:%M:%S'
		}, {
				id: 44,
				text: 'yy-MM HH:mm:ss',
				format: '%Y-%m %H:%M:%S'
		}, {
				id: 45,
				text: 'yy-M HH:mm:ss',
				format: '%Y-%-m %H:%M:%S'
		}, {
				id: 46,
				text: '[Month Name]-yy HH:mm:ss tt',
				format: '%B-%y %I:%M:%S %p'
		}, {
				id: 47,
				text: '[Month Name]-yyyy HH:mm:ss tt',
				format: '%B-%Y %I:%M:%S %p'
		}, {
				id: 48,
				text: '[Day Names of the Week], [Month Name] dd, yyyy HH:mm:ss tt',
				format: '%A, %B %d, %Y %I:%M:%S %p'
		}, {
				id: 49,
				text: '[Day Names of the Week], [Month Name] d, yyyy HH:mm:ss tt',
				format: '%A, %B %-d, %Y %I:%M:%S %p'
		}, {
				id: 50,
				text: '[Month Name]-yy HH:mm:ss',
				format: '%B-%y %H:%M:%S'
		}, {
				id: 51,
				text: '[Month Name]-yyyy HH:mm:ss',
				format: '%B-%Y %H:%M:%S'
		}, {
				id: 52,
				text: '[Day Names of the Week], [Month Name] dd, yyyy HH:mm:ss',
				format: '%A, %B %d, %Y %H:%M:%S'
		}, {
				id: 53,
				text: '[Day Names of the Week], [Month Name] d, yyyy HH:mm:ss',
				format: '%A, %B %-d, %Y %H:%M:%S'
		}
];

export const NUMERIC_FORMAT = [
		{
				id: 0,
				text: '0.00',
				format: '.2f'
		}, {
				id: 1,
				text: '0,000.00',
				format: ',.2f'
		}, {
				id: 2,
				text: '0000',
				format: '.0f'
		}, {
				id: 3,
				text: '$0.00',
				format: '$.2f'
		}, {
				id: 4,
				text: '$0,000.00',
				format: '$,.2f'
		}, {
				id: 5,
				text: '$0000',
				format: '$.0f'
		}, {
				id: 6,
				text: '$/100',
				format: ''
		}, {
				id: 7,
				text: '0.00%',
				format: ''
		}, {
				id: 8,
				text: '0,000.00%',
				format: ''
		}, {
				id: 9,
				text: '0000%',
				format: ''
		}, {
				id: 10,
				text: '% of Group',
				format: ''
		}, {
				id: 11,
				text: '% of Group (with rounding)',
				format: ''
		}, {
				id: 12,
				text: '1K',
				format: ''
		}, {
				id: 13,
				text: '1M',
				format: ''
		}, {
				id: 14,
				text: '1B',
				format: ''
		}
];

export const GOOGLEMAP_FIELD_MAPPING = {
		LAT_LNG: {
				id: 0,
				name: 'lat/lng'
		},
		COUNTRY: {
				id: 1,
				name: 'country'
		},
		POSTAL_CODE: {
				id: 2,
				name: 'postalCode'
		}
};