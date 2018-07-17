import './styles/index.scss';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';
import threeDColumnChart from './3dcharts/3dcolumnchart';

// Init the configuration of Izenda
IzendaSynergy.config(config);

// Extend Izenda chart with 3D column chart
threeDColumnChart(IzendaSynergy);

// Render whole Izenda UI into DOM
IzendaSynergy.render(document.getElementById('izenda-root'));
