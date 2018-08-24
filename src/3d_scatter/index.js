import ThreeDScatterChartOptionsBuilder from './3DScatterChartOptionsBuilder';
import {
  REPORT_PART_TYPES,
  CHART_STYLES,
  extendReportPartStyleConfiguration,
  createFieldContainerSchema
} from 'IzendaSynergy';

/**
 * Extend the chart visualization
 */
extendReportPartStyleConfiguration(REPORT_PART_TYPES.Chart, '3DScatter', CHART_STYLES.Scatter, {
  /**
   * Visual type to identify which Highchart type uto be rendered
   */
  visualType: 'scatter',
  /**
   * The label text shows in chart type dropdown
   */
  visualLabel: '3D Scatter',

  /**
   * Define which options builder class is using for this chart type
   */
  optionsBuilder: ThreeDScatterChartOptionsBuilder,

  /**
   * Declare Z-Axis Values field container
   */
  fieldContainerSchema: [createFieldContainerSchema('ZValues', 'Z-Axis Values', 'ZValues', null, 1)]
});
