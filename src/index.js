import './styles/index.scss';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';

import './models';
import './3dcommon';
import './3d_column';
import './3d_scatter';
import './columnnospace';
import './d3_timeline';
import './d3_googlemap';

// Init the configuration of Izenda
IzendaSynergy.config(config);

// Render whole Izenda UI into DOM
IzendaSynergy.render(document.getElementById('izenda-root'));
