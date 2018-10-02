import './lineargauge';
import './simplegauge';
import './solidgauge';

import {
  REPORT_PART_TYPES,
  getReportPartConfiguration,
  setReportPartConfiguration
} from 'IzendaSynergy';

import EnhancedReportPartGaugeContent from './EnhancedReportPartGaugeContent';

const gaugeConfiguration = getReportPartConfiguration(REPORT_PART_TYPES.Gauge);
gaugeConfiguration.model = EnhancedReportPartGaugeContent;
setReportPartConfiguration(REPORT_PART_TYPES.Gauge, gaugeConfiguration);