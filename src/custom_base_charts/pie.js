import {
  REPORT_PART_TYPES,
  CHART_STYLES,
  extendReportPartStyleConfiguration,
} from 'IzendaSynergy';

extendReportPartStyleConfiguration(REPORT_PART_TYPES.Chart, 'Custom Pie', CHART_STYLES.Pie, {
  visualLabel: 'Custom Pie',

  // Configure custom container
  //fieldContainerSchema: [createFieldContainerSchema('ZValues', 'Z-Axis Values', 'ZValues', null, 1)]
});
