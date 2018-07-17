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

  highchart3d(VisualizationLibrary);

  class ExColumnChartOptionsBuilder extends ColumnChartOptionsBuilder {
    constructor(...args) {
      super(...args);
    }

    buildOptionsByType(visualType, userOptions, dataParser) {
      let chartOptions = super.buildOptionsByType(visualType, userOptions, dataParser);
      const enabled3d = userOptions.chart && userOptions.chart.options3d && userOptions.chart.options3d.enabled;

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

  extendStyleConfiguration(TYPES.Chart, '3DColumn', CHART_STYLES.Column, {
    visualType: 'column',
    visualLabel: '3D Column',
    propertySchema: {
      groups: {
        chart: {
          fields: {
            '3d': {
              factory: createCheckBoxSchema,
              title: '3D options',
              value: 'getValueByKey',
              props: {
                title: '3D options'
              }
            }
          }
        }
      }
    },
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
    optionsBuilder: ExColumnChartOptionsBuilder,
    optionsMapping: {
      optionsByType: {
        '3d': { propKey: 'chart.options3d.enabled', defaultValue: true }
      }
    }
  });
};
