import {
  REPORT_PART_TYPES,
  extendReportPartStyleConfiguration,
} from 'IzendaSynergy';

extendReportPartStyleConfiguration(REPORT_PART_TYPES.Map, 'Custom Continent', 'Continent', {
  visualLabel: 'Custom Continent',

  // Configure custom container
  //fieldContainerSchema: [createFieldContainerSchema('ZValues', 'Z-Axis Values', 'ZValues', null, 1)]
});