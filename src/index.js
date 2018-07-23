import './styles/index.scss';
import highchart3d from 'highcharts/highcharts-3d';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';

import threeDColumnChart from './3d_column';
import threeDScatterChart from './3d_scatter';

// Init the configuration of Izenda
IzendaSynergy.config(config);

// Render whole Izenda UI into DOM
IzendaSynergy.render(document.getElementById('izenda-root'));
