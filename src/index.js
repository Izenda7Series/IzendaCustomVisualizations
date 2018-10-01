import './styles/index.scss';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';

import './visualization';

// Init the configuration of Izenda
IzendaSynergy.config(config);

// Render whole Izenda UI into DOM
IzendaSynergy.render(document.getElementById('izenda-root'));
