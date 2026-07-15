import { getClass } from "IzendaSynergy";

const { VisualizationLibrary } = getClass("HighchartVizEngine");

//Replace with the global Highcharts instance to load 3D module
const previousGlobalHighcharts = window._Highcharts;
window._Highcharts = VisualizationLibrary;

try {
  require("highcharts/highcharts-3d");
} finally {
  window._Highcharts = previousGlobalHighcharts;
}
