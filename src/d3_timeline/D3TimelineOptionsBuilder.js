import { getClass } from 'IzendaSynergy';
import { uniq, filter } from 'lodash';

const ChartOptionsBuilder = getClass('ChartOptionsBuilder');

export default class D3TimelineOptionsBuilder extends ChartOptionsBuilder {
  constructor(...args) {
    super(...args);
  }

  build() {
    const {
      visualType,
      chartOptions: { colors },
      chartData,
      fieldOptions,
      chartContainer
    } = this;

    const groupField = chartData.dataStructure['separators'][0];
    const labelField = chartData.dataStructure['values'][0];
    const startField = chartData.dataStructure['startRange'][0];
    const endField = chartData.dataStructure['endRange'][0];

    const lanes = uniq(chartData.records.map(r => r[groupField.columnName]));

    const items = filter(
      chartData.records.map(r => ({
        lane: lanes.indexOf(r[groupField.columnName]),
        id: r[labelField.columnName],
        start: r[startField.columnName],
        end: r[endField.columnName]
      })),
      r => r.start && r.end
    );

    return {
      type: visualType,
      lanes,
      items,
      colors
    };
  }
}
