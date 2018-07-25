import { getClass } from 'IzendaSynergy';

const ReportPartChartContent = getClass('ReportPartChartContent');

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

  container.elements.forEach(elm => (hasFunction = hasFunction && elm.haveFunction));

  return hasFunction;
};

/**
 * Extend existing ReportPartChartContent model to include ZValues field container info
 */
export default class EnhancedReportPartChartContent extends ReportPartChartContent {
  constructor(reportPartContent) {
    super(reportPartContent);

    //Add additional field container with name matches to dataKey setup in fieldContainerSchema
    this.addCustomContainer('ZValues');
  }

  /**
   * Override this properties to ensure all required fields exist and configured properly
   */
  get isBeingBuild() {
    const hasZValue = this.chartType !== '3DScatter' || hasAllFunctions(this['ZValues']);

    return super.isBeingBuild && hasZValue;
  }
}
