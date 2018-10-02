import './styles/index.scss';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';

import './3dcommon';
import threeDColumnChart from './3d_column';
import threeDScatterChart from './3d_scatter';
import './columnnospace';

import './custom_base_charts';
import './custom_base_gauges';
import './custom_base_maps';

// Init the configuration of Izenda
IzendaSynergy.config(config);

// Render whole Izenda UI into DOM
IzendaSynergy.render(document.getElementById('izenda-root'));
