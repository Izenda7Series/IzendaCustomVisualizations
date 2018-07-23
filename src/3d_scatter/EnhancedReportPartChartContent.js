import { getClass } from 'IzendaSynergy';

const ReportPartChartContent = getClass('ReportPartChartContent');

const hasElement = container => container && container.elements && container.elements.length > 0;

const hasAllFunctions = container => {
  if (!hasElement(container)) {
    return false;
  }

  let hasFunction = true;

  container.elements.forEach(elm => (hasFunction = hasFunction && elm.haveFunction));

  return hasFunction;
};

export default class EnhancedReportPartChartContent extends ReportPartChartContent {
  constructor(reportPartContent) {
    super(reportPartContent);
    this.addCustomContainer('ZValues');
  }

  get isBeingBuild() {
    const hasZValue = this.chartType !== '3DScatter' || hasAllFunctions(this['ZValues']);

    return super.isBeingBuild && hasZValue;
  }
}
