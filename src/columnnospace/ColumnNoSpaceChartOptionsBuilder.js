import $ from 'jquery';
import { getClass } from 'IzendaSynergy';

const ColumnChartOptionsBuilder = getClass('ColumnChartOptionsBuilder');

/**
 * The chart options builder to extend the current chart setting with Highchart no space option
 */
export default class ColumnNoSpaceChartOptionsBuilder extends ColumnChartOptionsBuilder {
  constructor(...args) {
    super(...args);
  }

  /**
   * Build the specific chart options by visualization type
   * @param {string} visualType The visualization type ('column')
   * @param {*} userOptions The options set in chart properties panel
   * @param {*} dataParser The data parser contains the query data and the data structures (fields, field mapping...)
   */
  buildOptionsByType(visualType, userOptions, dataParser) {
    // Get chart options from ColumnChartOptionsBuilder
    let chartOptions = super.buildOptionsByType(visualType, userOptions, dataParser);

    

    // Extend chart options with no space option
    $.extend(true, chartOptions, {
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0.00
        }
      }
    });

    return chartOptions;
  }
}
