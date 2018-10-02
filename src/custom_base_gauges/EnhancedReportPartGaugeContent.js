import { getClass } from 'IzendaSynergy';

const ReportPartGaugeContent = getClass('ReportPartGaugeContent');

export default class EnhancedReportPartChartContent extends ReportPartGaugeContent {
  getDefaultFunctionFormat(container, dataType) {
    // TODO: get base chart type, then resolve default function on this value
    return null;
  }
}
