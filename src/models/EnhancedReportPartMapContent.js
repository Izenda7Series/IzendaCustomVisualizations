import {getClass} from 'IzendaSynergy';

const ReportPartMapContent = getClass('ReportPartMapContent');

const hasElement = container => container && container.elements && container.elements.length > 0;

/**
 * Determine whether all fields in container has function (Group, Sum, Count...) setting.
 * @param {Object} container The field container object
 */
const hasAllFunctions = container => {
		if (!hasElement(container)) {
				return false;
		}

		let hasFunction = true;

		container
				.elements
				.forEach(elm => (hasFunction = hasFunction && elm.haveFunction));

		return hasFunction;
};

/**
* Extend existing ReportPartMapContent model for additional custom charts
 */
export default class EnhancedReportPartMapContent extends ReportPartMapContent {
		constructor(reportPartContent) {
				super(reportPartContent);
		}

		/**
 * Override this properties to ensure all required fields exist and configured properly
 */
		get isBeingBuild() {
				switch (this.chartType) {
						case 'GoogleMap':
								return (hasElement(this['country']) || hasAllFunctions(this['state']) || hasAllFunctions(this['county']) || hasAllFunctions(this['city']) || hasAllFunctions(this['postalCode']) || (hasAllFunctions(this['latitude']) && hasAllFunctions(this['longtitude']))) && hasAllFunctions(this['bubbleMetrics']);
						default:
								return super.isBeingBuild;
				}
		}

		getDefaultFunctionFormat(container, dataType) {
				return (super.getDefaultFunctionFormat(container, dataType) || {
						FUNCTION: {
								NAME: 'Group'
						},
						FORMAT: '',
						ON_NULL_FUNCTION: 'error'
				});
		}
}
