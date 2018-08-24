import { getClass } from 'IzendaSynergy';
import * as d3 from 'd3';
import 'd3-selection-multi';

const VizEngine = getClass('VizEngine');
const DEFAULT_COLORS = [
  '#7cb5ec',
  '#434348',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
  '#f15c80',
  '#e4d354',
  '#2b908f',
  '#f45b5b',
  '#91e8e1'
];

export default class D3VizEngine extends VizEngine {
  draw(chartContainer, chartType, options, onCompleted) {
    if (chartType === 'timeline') {
      const { lanes, items: data } = options;
      const colors = options.colors || DEFAULT_COLORS;
      const laneLength = lanes.length;
      const timeBegin = new Date('1996-07-01');
      const timeEnd = new Date('1998-06-01');
      const containerWidth = chartContainer.clientWidth;
      const containerHeight = chartContainer.clientHeight;

      var margin = [20, 10, 15, 140], //top right bottom left
        width = containerWidth - margin[1] - margin[3],
        height = containerHeight - margin[0] - margin[2],
        miniHeight = laneLength * 12 + 50,
        mainHeight = height - miniHeight - 50;

      //scales
      const x = d3
          .scaleTime()
          .domain([timeBegin, timeEnd])
          .range([0, width]),
        x1 = d3.scaleTime().range([0, width]),
        y1 = d3
          .scaleLinear()
          .domain([0, lanes.length])
          .range([0, mainHeight]),
        y2 = d3
          .scaleLinear()
          .domain([0, lanes.length])
          .range([0, miniHeight]);

      const tooltip = d3
        .select(chartContainer)
        .append('div')
        .styles({
          position: 'relative',
          'text-align': 'center',
          width: '60px',
          height: '28px',
          padding: '2px',
          font: '12px sans-serif',
          background: 'lightsteelblue',
          border: '0px',
          'border-radius': '8px',
          'pointer-events': 'none',
          opacity: 0
        });

      const svg = d3
        .select(chartContainer)
        .append('svg')
        .styles({
          'shape-rendering': 'crispEdges'
        })
        .attr('width', width + margin[1] + margin[3])
        .attr('height', height + margin[0] + margin[2]);

      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', mainHeight);

      const main = svg
        .append('g')
        .attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')
        .attr('width', width)
        .attr('height', mainHeight);

      const mini = svg
        .append('g')
        .attr('transform', 'translate(' + margin[3] + ',' + (mainHeight + margin[0]) + ')')
        .attr('width', width)
        .attr('height', miniHeight)
        .attr('class', 'mini');

      //main lanes and texts
      main
        .append('g')
        .selectAll('.laneLines')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', margin[1])
        .attr('y1', d => y1(d.lane))
        .attr('x2', width)
        .attr('y2', d => y1(d.lane))
        .attr('stroke', 'lightgray');

      main
        .append('g')
        .selectAll('.laneText')
        .data(lanes)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', -margin[1])
        .attr('y', (d, i) => y1(i + 0.5))
        .attr('dy', '.5ex')
        .attr('text-anchor', 'end')
        .styles({ font: '12px sans-serif' });

      //mini lanes and texts
      mini
        .append('g')
        .selectAll('.laneLines')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', margin[1])
        .attr('y1', d => y2(d.lane))
        .attr('x2', width)
        .attr('y2', d => y2(d.lane))
        .attr('stroke', 'lightgray');

      mini
        .append('g')
        .selectAll('.laneText')
        .data(lanes)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', -margin[1])
        .attr('y', (d, i) => y2(i + 0.5))
        .attr('dy', '.5ex')
        .attr('text-anchor', 'end')
        .styles({ font: '9px sans-serif' });

      const itemRects = main.append('g').attr('clip-path', 'url(#clip)');

      //mini item rects
      mini
        .append('g')
        .selectAll('miniItems')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(new Date(d.start)))
        .attr('y', d => y2(d.lane + 0.5) - 5)
        .attr('width', d => x(new Date(d.end)) - x(new Date(d.start) || x(1)))
        .attr('height', 10)
        .styles(d => ({
          'stroke-width': 6,
          fill: colors[d.lane % colors.length]
        }));

      //brush
      const brush = d3
        .brushX()
        .extent([[0, 0], [width, miniHeight]])
        .on('brush', display);

      mini
        .append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', 1)
        .attr('height', miniHeight - 1);

      display();

      function display() {
        const selection = d3.event && d3.event.selection;
        if (!selection) return;
        let rects,
          labels,
          timeSelection = selection.map(x.invert),
          minExtent = timeSelection[0],
          maxExtent = timeSelection[1],
          visItems = data.filter(d => new Date(d.start) < maxExtent && new Date(d.end) > minExtent);

        x1.domain([minExtent, maxExtent]);

        //update main item rects
        rects = itemRects
          .selectAll('rect')
          .data(visItems, d => d.id)
          .attr('x', d => x1(new Date(d.start)))
          .attr('width', d => x1(new Date(d.end)) - x1(new Date(d.start)) || x1(1));

        rects
          .enter()
          .append('rect')
          .attr('x', d => x1(new Date(d.start)))
          .attr('y', d => y1(d.lane) + 3)
          .attr('width', d => x1(new Date(d.end)) - x1(new Date(d.start)) || x1(1))
          .attr('height', d => y1(1) - 6)
          .styles(d => ({
            'stroke-width': 6,
            opacity: 0.6,
            fill: colors[d.lane % colors.length]
          }))
          .on('mouseover', function(d) {
            const point = d3.mouse(chartContainer);
            tooltip.styles({ left: '', top: '' });

            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltip.styles({ left: point.x + 'px', top: point.y + 'px' }).html(d.id);
          })
          .on('mouseout', function(d) {
            tooltip
              .transition()
              .duration(500)
              .style('opacity', 0);
          });

        rects.exit().remove();
      }
    }
  }
}
