import './styles/index.scss';

import IzendaSynergy from 'IzendaSynergy';
import config from './config';
import threeDColumnChart from './3dcharts/3dcolumnchart';

IzendaSynergy.config(config);

threeDColumnChart(IzendaSynergy);

IzendaSynergy.render(document.getElementById('izenda-root'));
