# Izenda Custom Visualizations 

> _Note that this example is meant to demonstrate the flexibility of the Izenda JS API to adopt the various requirements on building a custom chart._

This repo contains code examples showing how to customize or extend the Izenda visualizations using JS APIs. It is based on original 3D Highcharts examples at https://www.highcharts.com/docs/chart-concepts/3d-charts

- 3D Column chart (/src/3d_column) demonstrates the ability of extending a column chart by adding an "Enable 3D" checkbox option into the property panel of the report designer.
  ![3D Column Chart](docs/imgs/3DColumn_Chart.png)
- 3D Scatter chart (/src/3d_scatter) demonstrates the ability of extending a scatter chart by adding an additional field container (Z-Axis Values) and rendering the scatter plot in a 3 dimensional chart.
  ![3D Scatter Chart](docs/imgs/3D_Scatter.png)
- Column No Space (/src/columnnospace) demonstrates the ability of extending a column chart by altering the padding between the columns to show no space between the groupings.
  ![Column No Space](docs/imgs/ColumnNoSpace.png)
- D3 Timeline (src/d3_timeline) demonstrates the ability of implementing a timeline chart using D3.js.
- Google Map (src/d3_googlemap) demonstrates the ability of implementing a custom Map visualization using Google Map api.

### Installation

- Download EmbeddedUI.zip in Izenda download site and extract into libs/IzendaSynergy folder
- Change the WebAPIUrl value to Izenda Standalone BE API in /src/config.js
- Run following npm command

```
npm install
```

### Start Dev Server

```
npm run dev
```

### Build Prod Version

```
npm run build
```

### Deploy the custom visualization into Izenda app

#### Step 1: Run production build

```
npm run build
```

It produces the compiled files in ./dist folder

#### Step 2: Copy izenda_visualizations.js and izenda_visualizations.css into Izenda UI folder inside the hosting application

#### Step 3: Include those files in the index.html or the Izenda UI hosting page like other izenda_ui.js, izenda_ui.css files.

## Configure the Google Map visualization

Set Google Map API key in src/d3_googlemap/D3VizEngine.js file

```javascript
const defaultCreateCache = () => {
  return ScriptCache({
    google: GoogleApi({
      apiKey: 'GOOGLE_API_KEY', // Please put your GOOGLE_API_KEY here
      version: 'v=3.34' //GOOGLE MAP API version
    })
  });
};
```

## How to create a custom Izenda visualization

### Step 1 - Integrate Izenda UI library into Webpack configuration

To integrate Izenda UI library with Webpack build as the external library, we uses [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin) to simplify Izenda UI integration settings, let them automatically adjust the externals property of Webpack config, copy and bunble the Izenda UI assets to the output.

The configuration has been set in /webpack/webpack.common.js config file

```javascript
{
  // Name of module. It allows using import('IzendaSynergy') in the code regardless its location.
  // The plugin also uses the name of module when probbing Izenda UI file assets under /libs folder which is configured as the context path.
  module: 'IzendaSynergy',

  // The order of entry does matter. The lower entry depends on upper entry.
  entry: [
    {
      path: 'izenda-ui.css',
      type: 'css',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'izenda_common.js',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'izenda_locales.js',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'izenda_vendors.js',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'izenda_ui.js',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    }
  ],
  // Additional assets that need to be copied into the output path
  supplements: [
    {
      path: 'assets/',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'plugins/',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'skins/',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'themes/',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    // The source map files are optional.
    {
      path: 'izenda_ui.js.map',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    },
    {
      path: 'izenda_vendors.js.map',
      cwpPatternConfig: {
        context: Path.resolve(__dirname, '../libs')
      }
    }
  ],

  // The name of module exported globally. It can be accessed using the global name.
  global: 'IzendaSynergy'
}
```

### Step 2 - Take a sample chart and start coding

The Izenda UI Javascript APIs offer multiple levels of customization for the built-in visualizations, e.g. chart, gauge or map, as well as the tool's user interface elements to ensure a better user experience just like the built-in functions.

Izenda's custom visualization API inherits configuration from the Izenda application, so you don't have to build custom charts, gauges or maps from scratch. With this approach, you can base your custom item off of an existing visualization. This allows you to write less code without sacrificing built-in features.

There are two common scenarios that the Izenda Javascript APIs can be used for:

1.  Making a custom chart type based on the standard Izenda visualization engines (Highcharts and Highmap)

    - IInherit and extend the options builder to change the Highchart/Highmap options in order to let it render the desired visualization. You must identify what chart options need to be set for 3D column, for example https://jsfiddle.net/highcharts/2fuRA, then populate the same options in the option builder.
    - Use `extendReportPartStyleConfiguration` function to create a custom chart type.

2.  Making a custom chart type with another new visualization engine, e.g. D3 data visualization, Bing/Google map...

    - Inherit and extend visualization engine (VizEngine, HighchartVizEngine, HighmapVizEngine). See `getClass` function to find out how to get the class.
    - Use `registerVisualizationEngine` to add a new visualization engine class.

Please read through the code example in src/3d_column and src/3d_scatter and the [API documents](https://www.izenda.com/docs/dev/api_frontend_integration.html)

### Credit:

The codebase was initiated from https://github.com/wbkd/webpack-starter
