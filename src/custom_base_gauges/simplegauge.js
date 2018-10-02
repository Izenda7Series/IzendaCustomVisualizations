import {
  REPORT_PART_TYPES,
  CHART_STYLES,
  extendReportPartStyleConfiguration,
} from 'IzendaSynergy';

extendReportPartStyleConfiguration(REPORT_PART_TYPES.Gauge, 'Custom SimpleGauge', CHART_STYLES.SimpleGauge, {
  visualLabel: 'Custom SimpleGauge',

  // Configure custom container
  //fieldContainerSchema: [createFieldContainerSchema('ZValues', 'Z-Axis Values', 'ZValues', null, 1)]
});
