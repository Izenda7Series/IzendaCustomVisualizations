import {
  REPORT_PART_TYPES,
  registerVisualizationEngine,
  extendReportPartStyleConfiguration,
  createFieldContainerSchema
} from 'IzendaSynergy';
import D3TimelineVizEngine from './D3TimelineVizEngine';
import D3TimelineOptionsBuilder from './D3TimelineOptionsBuilder';

registerVisualizationEngine('D3Timeline', D3TimelineVizEngine);

/**
 * Extend the chart visualization by specifying
 *  - Report part type to extend: REPORT_PART_TYPES.Chart
 *  - Style name: 'ColumnNoSpace'
 *  - Base style to extend: CHART_STYLES.Column
 *  - The ColumnNoSpace configuration
 */
extendReportPartStyleConfiguration(REPORT_PART_TYPES.Chart, 'Timeline', null, {
  /**
   * Visual type to identify which Highchart type to be rendered
   */
  visualType: 'timeline',

  /**
   * The label text shows in chart type dropdown
   */
  visualLabel: 'Timeline',

  visualEngine: 'D3Timeline',

  /**
   * Declare Z-Axis Values field container
   */
  fieldContainerSchema: [
    createFieldContainerSchema('Groups', 'Groups', 'separators', null, 1),
    createFieldContainerSchema('Metrics', 'Metrics', 'values', null, 1),
    createFieldContainerSchema('StartRange', 'Start Range', 'startRange', null, 1),
    createFieldContainerSchema('EndRange', 'End Range', 'endRange', null, 1)
  ],

  /**
   * Define which options builder class is using for this chart type
   */
  optionsBuilder: D3TimelineOptionsBuilder
});
