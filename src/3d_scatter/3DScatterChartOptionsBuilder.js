import $ from 'jquery';
import { getClass, ReportPartUtils } from 'IzendaSynergy';

const ScatterChartOptionsBuilder = getClass('ScatterChartOptionsBuilder');
const HighchartVizEngine = getClass('HighchartVizEngine');

const highcharts = HighchartVizEngine.VisualizationLibrary;

const gradientEffectColor = color => ({
  radialGradient: { cx: 0.4, cy: 0.3, r: 0.5 },
  stops: [
    [0, color],
    [
      1,
      highcharts
        .Color(color)
        .brighten(-0.2)
        .get('rgb')
    ]
  ]
});

/**
 * The chart options builder to extend the current chart setting with Highchart 3D options
 */
export default class ThreeDScatterChartOptionsBuilder extends ScatterChartOptionsBuilder {
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
    const {
      plotOptions: {
        series: { colorByPoint }
      },
      izDisableMultiColor,
      izendaSeriesConfig
    } = userOptions;

    // Get chart options from ScatterChartOptionsBuilder
    let chartOptions = super.buildOptionsByType(visualType, userOptions, dataParser);

    const nameFieldMapping = dataParser.dataStructure['valuesLabels'][0];
    const zFieldMapping = dataParser.dataStructure['ZValues'][0];

    const zAxisType = ReportPartUtils.getAxisType(zFieldMapping).type;
    const zAxisConfig = izendaSeriesConfig[zFieldMapping.fieldNameAlias];

    const isMultiColor = colorByPoint && !izDisableMultiColor;
    const zCategories = { obj: {}, arr: [] };

    // Loop thru each serie of data
    chartOptions.series.forEach(serie => {
      const data = serie.data;
      serie.zAxisField = zFieldMapping;
      if (data) {
        // Loop thru each point in serie
        data.forEach(point => {
          const { record } = point;
          const zRawData = record[zFieldMapping.columnName];

          isMultiColor && (point.color = gradientEffectColor(point.color));

          Object.assign(point, {
            zRawData,
            z: this.getAxisData(zRawData, zCategories, zAxisType, zAxisConfig)
          });
        });
      }
    });

    userOptions.colors && (userOptions.colors = userOptions.colors.map(color => gradientEffectColor(color)));

    // Extend chart options with 3D options
    $.extend(true, chartOptions, {
      zAxis: {
        labels: { formatter: ReportPartUtils.getFormattedLabelAxis },
        type: zAxisType
      },
      chart: {
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          // fitToPlot: false,
          frame: {
            bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
            back: { size: 1, color: 'rgba(0,0,0,0.04)' },
            side: { size: 1, color: 'rgba(0,0,0,0.06)' }
          }
        }
      },
      plotOptions: {
        scatter: {
          width: 10,
          height: 10,
          depth: 10
        }
      }
    });

    return chartOptions;
  }
}
