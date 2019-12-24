import { getClass } from 'IzendaSynergy';
import * as d3 from 'd3';
import 'd3-selection-multi';
import './styles.css';
import { helpers } from '../utils/CustomVizHelper';

const VizEngine = getClass('VizEngine');

export default class D3TimelineVizEngine extends VizEngine {
  /*
			@fn: draw
			@scope: draw timeline chart.
			@params: chartContainer, chartType, options, onCompleted.
			@returns: n/a
	*/
  draw(chartContainer, chartType, options, onCompleted) {
    if (chartType === 'timeline') {
      //extract properties from chart's options
      const {
        data: { arrGroup: group, items: data },
        fieldNameAlias,
        formats: { metric: metricFormat, range: rangeFormat },
        range: { timelineBegin, timelineEnd },
        scales: { x, x1, x2, y1, y2 },
        styles: { colors, isShowTooltip, plotBgColor },
        fieldOptions: { groupOptions, metricOptions, startOptions },
        hasParseAxisData
      } = options;

      const containerWidth = chartContainer.clientWidth;
      const containerHeight = chartContainer.clientHeight;
      //create color scale
      const colorScale = d3.scaleOrdinal(colors).domain(data.map(d => d.groupId));
      //calculate width, height
      const margin = [40, 10, 30, 140],
        width = containerWidth - margin[1] - margin[3],
        height = containerHeight - margin[0] - margin[2],
        miniHeight = group.length * 8 + 20,
        mainHeight = height - miniHeight - 50,
        space = 20; //space between mini and main charts
      //bind range for scales
      x.range([0, width]);
      x1.range([0, width]);
      y1.range([0, mainHeight]);
      y2.range([0, miniHeight]);
      x2.range([0, width]);
      //create svg container
      const svg = d3
        .select(chartContainer)
        .append('svg')
        .styles({ 'shape-rendering': 'crispEdges' })
        .attr('width', width + margin[1] + margin[3])
        .attr('height', height + margin[0] + margin[2]);
      //add plot area and bind setting color
      const plotArea = svg
        .append('rect')
        .attr('transform', `translate(${margin[3]},${margin[0]})`)
        .attr('width', width)
        .attr('height', height - margin[2])
        .classed('plot-area', true)
        .attr('fill', plotBgColor);
      //add clippath
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', mainHeight);
      //add main area
      const main = svg
        .append('g')
        .attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')
        .attr('width', width)
        .attr('height', mainHeight)
        .classed('main', true);
      //add mini area
      const mini = svg
        .append('g')
        .attr('transform', `translate(${margin[3]},${mainHeight + margin[0] + space})`)
        .attr('width', width)
        .attr('height', miniHeight)
        .classed('mini', true);
      //format axis
      const xAxisTopCall = d3
          .axisTop(x1)
          .tickFormat(d => {
            if (rangeFormat) {
              return helpers.formatData(rangeFormat, d, startOptions.fieldDataType);
            } else {
              return d;
            }
          })
          .ticks(8)
          .tickSize(3),
        xAxisBottomCall = d3
          .axisBottom(x)
          .tickFormat(d => {
            if (rangeFormat) {
              return helpers.formatData(rangeFormat, d, startOptions.fieldDataType);
            } else {
              return d;
            }
          })
          .ticks(8)
          .tickSize(3);
      //add axis to svg
      const xAxis = svg
        .append('g')
        .classed('axis bottom', true)
        .attr('transform', `translate(${margin[3]},${height + space / 2})`)
        .call(xAxisBottomCall)
        .selectAll('.tick text')
        .style('text-anchor', 'middle');

      svg
        .append('g')
        .classed('axis top', true)
        .attr('transform', `translate(${margin[3]},${margin[0] - 1})`)
        .call(xAxisTopCall)
        .selectAll('text')
        .style('text-anchor', 'middle');
      //add label(start column alias - end column alias) for xAxis bottom
      svg
        .append('text')
        .attr('transform', `translate( ${containerWidth / 2},${height + margin[0] + 20})`)
        .style('text-anchor', 'middle')
        .classed('chart-label', true)
        .text(`${fieldNameAlias.startField} - ${fieldNameAlias.endField}`);
      //add label(group column alias) for yAxis
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', '30')
        .attr('x', -margin[3])
        .style('text-anchor', 'middle')
        .classed('chart-label', true)
        .text(`${fieldNameAlias.groupField}`);
      //append tooltip to chart container
      const tooltip = d3
        .select(document.querySelector('body'))
        .append('div')
        .classed('d3-timeline-tooltip', true);

      //main group and texts
      main
        .append('g')
        .selectAll('.groupLines')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', margin[1] - 10)
        .attr('y1', d => y1(d.groupId))
        .attr('x2', width)
        .attr('y2', d => y1(d.groupId))
        .attr('stroke', 'lightgray');
      // add label text for main area
      svg
        .append('g')
        .classed('mainGroupTexts', true)
        .attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')
        .selectAll('.groupText')
        .data(group)
        .enter()
        .append('text')
        .attr('x', -margin[1])
        .attr('y', (d, i) => y1(i + 0.5))
        .attr('dy', '.5ex')
        .attr('text-anchor', 'end')
        .style('font', '12px sans-serif')
        .attr('fill', d => d.textColor)
        .text(d => d.alternativeText);

      //mini group and texts
      mini
        .append('g')
        .selectAll('.groupLines')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', margin[1] - 10)
        .attr('y1', d => y2(d.groupId))
        .attr('x2', width)
        .attr('y2', d => y2(d.groupId))
        .attr('stroke', 'lightgray');
      //add label for mini group
      svg
        .append('g')
        .attr('transform', `translate(${margin[3]},${mainHeight + margin[0] + space})`)
        .classed('miniGroupTexts', true)
        .selectAll('.groupText')
        .data(group)
        .enter()
        .append('text')
        .attr('x', -margin[1])
        .attr('y', (d, i) => y2(i + 0.5))
        .attr('dy', '.5ex')
        .attr('text-anchor', 'end')
        .style('font', '9px sans-serif')
        .attr('fill', d => d.textColor)
        .text(d => d.alternativeText);

      //draw rect for main area
      const itemRects = main.append('g').attr('clip-path', 'url(#clip)');

      //draw mini rects and fill color following by user settings
      mini
        .append('g')
        .selectAll('miniItems')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.parsedStart))
        .attr('y', d => y2(d.groupId + 0.5) - 5)
        .attr('width', d => x(d.parsedEnd) - x(d.parsedStart) || x(1))
        .attr('height', 10)
        .attr('stroke-width', 6)
        .attr('fill', d => {
          return d.fillColor ? d.fillColor : colorScale(d.groupId);
        });
      //define brush with extent [[0, 0][width, miniHeight]]
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, miniHeight]
        ])
        .on('brush', brushed);
      //call brush
      mini
        .append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', 1)
        .attr('height', miniHeight - 1);

      //call brush default
      d3.select('.brush')
        .transition()
        .call(brush.move, [0, width]);

      //timeline tooltip
      const _tooltip = function(selection) {
        const checkMetricAlterText = d => {
          const alterText = helpers.getSettings(metricOptions, 'alternativeText', d.value, d.percentage);
          return alterText !== d.value
            ? alterText
            : metricFormat
            ? helpers.formatData(metricFormat, d.value, metricOptions.fieldDataType)
            : d.value;
        };

        if (!isShowTooltip) return;
        selection
          .on('mouseover.d3-timeline-tooltip', d => {
            //get data of item and then render into html
            const htmlTooltip = `<p class="text-name">${fieldNameAlias.groupField}: ${helpers.getSettings(
              groupOptions,
              'alternativeText',
              d.groupName,
              d.percentage
            )}</p><p>${fieldNameAlias.startField}: <span>${
              rangeFormat ? helpers.formatData(rangeFormat, d.parsedStart, startOptions.fieldDataType) : d.parsedStart
            }</span></p><p>${fieldNameAlias.endField}: <span>${
              rangeFormat ? helpers.formatData(rangeFormat, d.parsedEnd, startOptions.fieldDataType) : d.parsedEnd
            }</span></p><p>${fieldNameAlias.groupField}: <span>${checkMetricAlterText(d)}</span></p>`;

            tooltip
              .transition()
              .duration(200)
              .style('opacity', 1);
            tooltip
              .html(htmlTooltip)
              .style('left', `${d3.event.pageX + 5}px`)
              .style('top', `${d3.event.pageY + 5}px`);
          })
          .on('mousemove.d3-timeline-tooltip', () => {
            //update tooltip's position
            tooltip.style('left', `${d3.event.pageX + 5}px`).style('top', `${d3.event.pageY + 5}px`);
          })
          .on('mouseout.d3-timeline-tooltip', () => {
            //transition and hide tooltip
            tooltip
              .transition()
              .duration(500)
              .style('opacity', 0);
          });
      };

      function brushed() {
        //get brush selection
        const selection = d3.event && d3.event.selection;

        //return immediatelly with no detected selection
        if (!selection) return;

        // calculate the new range and filter data which belongs to new range.
        let timeSelection = selection.map(x.invert),
          minExtent = timeSelection[0],
          maxExtent = timeSelection[1],
          visItems = data.filter(d => d.parsedStart < maxExtent && d.parsedEnd > minExtent);

        //update domain for main axis
        x1.domain([minExtent, maxExtent]);

        //call axis top to update with new domain
        svg
          .select('.axis.top')
          .transition()
          .call(xAxisTopCall);

        // select all main rects and bind data to them
        let rects = itemRects.selectAll('rect').data(visItems, d => d.value);

        //remove surplus rects
        rects.exit().remove();

        // add new rect and create a new selection, merge the new and the existing rects
        // and update attributes for the merged selection
        rects = rects
          .enter()
          .append('rect')
          .merge(rects)
          .attr('x', d => x1(d.parsedStart))
          .attr('y', d => y1(d.groupId) + 3)
          .attr('width', d => x1(d.parsedEnd) - x1(d.parsedStart) || 0)
          .attr('height', d => y1(1) - 6)
          .styles(d => ({
            'stroke-width': 6,
            fill: () => {
              return d.fillColor ? d.fillColor : colorScale(d.groupId);
            }
          }))
          .call(_tooltip);

        //notify finish renderring
        onCompleted && onCompleted();
      }
    } // end of draw timeline chart
  }
}
