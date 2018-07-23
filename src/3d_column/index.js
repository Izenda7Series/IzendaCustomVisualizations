import $ from 'jquery';
import ThreeDColumnChartOptionsBuilder from './3DColumnChartOptionsBuilder';
import {
  REPORT_PART_TYPES,
  CHART_STYLES,
  extendReportPartStyleConfiguration,
  createCheckBoxPropertySchema
} from 'IzendaSynergy';

/**
 * Extend the chart visualization
 */
extendReportPartStyleConfiguration(REPORT_PART_TYPES.Chart, '3DColumn', CHART_STYLES.Column, {
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
            factory: createCheckBoxPropertySchema,
            title: 'Enable 3D',
            value: 'getValueByKey',
            props: { title: 'Enable 3D' }
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
  optionsMapping: { optionsByType: { '3d': { propKey: 'chart.options3d.enabled', defaultValue: true } } }
});
