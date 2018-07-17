import $ from 'jquery';
import highchart3d from 'highcharts/highcharts-3d';

export default IzendaSynergy => {
  const {
    ReportPart: { TYPES, CHART_STYLES, extendStyleConfiguration },
    PropertyEditor: { createCheckBoxSchema },
    ServiceProvider
  } = IzendaSynergy;

  const ColumnChartOptionsBuilder = ServiceProvider.get('ColumnChartOptionsBuilder');
  const { VisualizationLibrary } = ServiceProvider.get('HighchartVizEngine');

  /**
   * Extend Highchart library with 3D module
   */
  highchart3d(VisualizationLibrary);

  /**
   * The chart options builder to extend the current chart setting with Highchart 3D options
   */
  class ThreeDColumnChartOptionsBuilder extends ColumnChartOptionsBuilder {
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

  /**
   * Extend the chart visualization
   */
  extendStyleConfiguration(TYPES.Chart, '3DColumn', CHART_STYLES.Column, {
    /**
     * Visual type to identify which Highchart type to be rendered
     */
    visualType: 'column',

    /**
     * The label text shows in chart type dropdown
     */
    visualLabel: '3D Column',

    /**
     * Extend the chart properties panel with 3D checkbox under chart setting group
     */
    propertySchema: {
      groups: {
        chart: {
          fields: {
            '3d': {
              factory: createCheckBoxSchema,
              title: 'Enable 3D',
              value: 'getValueByKey',
              props: {
                title: 'Enable 3D'
              }
            }
          }
        }
      }
    },

    /**
     * A higher order function to handle value change, e.g. toggle Enable 3D checkbox
     */
    propertyValueChange: (reportPartDetails, fieldStore) => (
      chartProperties,
      schemaData,
      changedKey,
      changedKeyPath,
      changedValue,
      changedOthersInfo
    ) => {
      const threeDOptions = schemaData.chart['3d'];
      chartProperties.optionByType['3d'] = threeDOptions ? threeDOptions.value : false;
    },

    /**
     * Define which options builder class is using for this chart type
     */
    optionsBuilder: ThreeDColumnChartOptionsBuilder,

    /**
     * Map the 3d options value into userOptions which is passed into option builder
     */
    optionsMapping: {
      optionsByType: {
        '3d': { propKey: 'chart.options3d.enabled', defaultValue: true }
      }
    }
  });
};
