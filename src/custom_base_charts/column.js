import {
  REPORT_PART_TYPES,
  CHART_STYLES,
  extendReportPartStyleConfiguration,
} from 'IzendaSynergy';

extendReportPartStyleConfiguration(REPORT_PART_TYPES.Chart, 'Custom Column', CHART_STYLES.Column, {
  visualLabel: 'Custom Column',

  // Configure custom container
  //fieldContainerSchema: [createFieldContainerSchema('ZValues', 'Z-Axis Values', 'ZValues', null, 1)]
});
