import $ from 'jquery';
import { getClass } from 'IzendaSynergy';

const ColumnChartOptionsBuilder = getClass('ColumnChartOptionsBuilder');

/**
 * The chart options builder to extend the current chart setting with Highchart 3D options
 */
export default class ThreeDColumnChartOptionsBuilder extends ColumnChartOptionsBuilder {
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

    // Determine whether 3D option is enabled
    const enabled3d = userOptions.chart && userOptions.chart.options3d && userOptions.chart.options3d.enabled;

    // Extend chart options with 3D options
    $.extend(true, chartOptions, {
      chart: {
        options3d: {
          enabled: enabled3d !== undefined ? enabled3d : true,
          alpha: 15,
          beta: 15,
          depth: 50
        }
      },
      plotOptions: {
        column: {
          depth: 25
        }
      }
    });

    return chartOptions;
  }
}
