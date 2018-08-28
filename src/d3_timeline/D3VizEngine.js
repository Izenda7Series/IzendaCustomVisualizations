import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import 'd3-selection-multi';
import './styles.css';

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
						const {lanes, items: data} = options;
						const colors = options.colors || DEFAULT_COLORS;
						const laneLength = lanes.length;

						const containerWidth = chartContainer.clientWidth;
						const containerHeight = chartContainer.clientHeight;

						//this config will be replaced by options which is called from api
						const chartConfigs = {
								timeFormat: "%Y-%m-%d",
								xAlias: "Date",
								tickNumber: 8,
								freight: {
										fieldNameAlias: "Freight",
										typeFormat: ".2f"
								}
						};

						const formatFloat = d3.format(chartConfigs.freight.typeFormat);
						const timeFormat = d3.timeFormat(chartConfigs.timeFormat);
						const parseTime = d3.timeParse(chartConfigs.timeFormat);

						const utcParse = d3.utcParse("%Y-%m-%dT%H:%M:%S");
						const timeBegin = parseTime('1996-07-01');
						const timeEnd = parseTime('1998-06-01');

						const colorScale = d3
								.scaleOrdinal(colors)
								.domain(data.map(d => d.lane));

						const margin = [
										40, 10, 30, 140
								],
								width = containerWidth - margin[1] - margin[3],
								height = containerHeight - margin[0] - margin[2],
								miniHeight = laneLength * 12 + 50,
								mainHeight = height - miniHeight - 50;

						//convert data
						data.forEach((item) => {
								item.start = utcParse(item.start);
								item.end = utcParse(item.end);
								item.id = formatFloat(item.id);
								item.laneName = lanes[item.lane];
						});

						//scales
						const x = d3
										.scaleTime()
										.domain([timeBegin, timeEnd])
										.range([0, width]),
								x1 = d3
										.scaleTime()
										.range([0, width])
										.domain([timeBegin, timeEnd]),
								y1 = d3
										.scaleLinear()
										.domain([0, lanes.length])
										.range([0, mainHeight]),
								y2 = d3
										.scaleLinear()
										.domain([0, lanes.length])
										.range([0, miniHeight]),
								x2 = d3
										.scaleTime()
										.range([0, width]); //this is for top time scale

						const svg = d3
								.select(chartContainer)
								.append('svg')
								.styles({'shape-rendering': 'crispEdges'})
								.attr('width', width + margin[1] + margin[3])
								.attr('height', height + margin[0] + margin[2]);

						svg
								.append('defs')
								.append('clipPath')
								.attr('id', 'clip')
								.append('rect')
								.attr('width', width)
								.attr('height', mainHeight);

						const containerNode = d3
								.select(chartContainer)
								.node();

						const main = svg
								.append('g')
								.attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')
								.attr('width', width)
								.attr('height', mainHeight)
								.classed('main', true);

						const mini = svg
								.append('g')
								.attr('transform', 'translate(' + margin[3] + ',' + (mainHeight + margin[0]) + ')')
								.attr('width', width)
								.attr('height', miniHeight)
								.classed('mini', true);

						const xAxis = svg
								.append("g")
								.attr("class", "axis bottom")
								.attr("transform", `translate(${margin[3]},${height})`)
								.call(d3.axisBottom(x).tickFormat(timeFormat).ticks(chartConfigs.tickNumber))
								.selectAll("text")
								.style("text-anchor", "middle");

						// this axis for calling
						const xAxisTopCall = d3
								.axisTop(x1)
								.tickFormat(timeFormat)
								.ticks(chartConfigs.tickNumber);

						svg
								.append("g")
								.attr("class", "axis top")
								.attr("transform", `translate(${margin[3]},${margin[0] - 10})`)
								.call(xAxisTopCall)
								.selectAll("text")
								.style("text-anchor", "middle");
						// .attr("dx", "-.8em") .attr("dy", ".15em") .attr("transform", "rotate(-45)");

						svg
								.append("text")
								.attr("transform", `translate( ${containerWidth / 2},${ (height + margin[0] + 20)})`)
								.style("text-anchor", "middle")
								.classed("chart-label", true)
								.text(chartConfigs.xAlias);

						svg
								.append("text")
								.attr("transform", "rotate(-90)")
								.attr("y", height / 2)
								.attr("x", -margin[3])
								.attr("dy", "-1em")
								.style("text-anchor", "middle")
								.classed("chart-label", true)
								.text(chartConfigs.fieldNameAlias);

						const tooltip = d3
								.select(chartContainer)
								.append('div')
								.classed('tooltip', true);
						const toolTipY = y1(1) - 6;

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
								.styles({font: '12px sans-serif'});

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
								.styles({font: '9px sans-serif'});

						const itemRects = main
								.append('g')
								.attr('clip-path', 'url(#clip)');

						//mini item rects
						mini
								.append('g')
								.selectAll('miniItems')
								.data(data)
								.enter()
								.append('rect')
								.attr('x', d => x(d.start))
								.attr('y', d => y2(d.lane + 0.5) - 5)
								.attr('width', d => x(d.end) - x(d.start) || x(1))
								.attr('height', 10)
								.styles(d => ({
										'stroke-width': 6,
										'fill': colorScale(d.lane)
								}));

						//brush
						const brush = d3
								.brushX()
								.extent([
										[
												0, 0
										],
										[width, miniHeight]
								])
								.on('brush', display);

						mini
								.append('g')
								.attr('class', 'x brush')
								.call(brush)
								.selectAll('rect')
								.attr('y', 1)
								.attr('height', miniHeight - 1);

						display();

						const _tooltip = function _tooltip(selection) {
								selection
										.on('mouseover.tooltip', function (d) {
												const htmlTooltip = `<span class="text-name">Lane: ${d.laneName}</span><span>Value: ${d.id}</span>`;
												tooltip
														.transition()
														.duration(200)
														.style("opacity", 0.9);
												tooltip
														.html(htmlTooltip)
														.style("left", `${d3.event.pageX}px`)
														.style("top", `${d3.event.pageY}px`);
										})
										.on('mouseout.tooltip', () => {
												tooltip
														.transition()
														.duration(500)
														.style('opacity', 0);
										});
						};

						function display() {
								const selection = d3.event && d3.event.selection;
								if (!selection) 
										return;
								let rects,
										labels,
										timeSelection = selection.map(x.invert),
										minExtent = timeSelection[0],
										maxExtent = timeSelection[1],
										visItems = data.filter(d => d.start < maxExtent && d.end > minExtent);

								x1.domain([minExtent, maxExtent]);
								svg
										.select('.axis.top')
										.transition()
										.call(xAxisTopCall);
								// scale at top update main item rects
								rects = itemRects
										.selectAll('rect')
										.data(visItems, d => d.id)
										.attr('x', d => x1(d.start))
										.attr('width', d => x1(d.end) - x1(d.start) || 0);

								rects
										.enter()
										.append('rect')
										.attr('x', d => x1(d.start))
										.attr('y', d => y1(d.lane) + 3)
										.attr('width', d => x1(d.end) - x1(d.start) || 0)
										.attr('height', d => y1(1) - 6)
										.styles(d => ({
												'stroke-width': 6,
												'opacity': 0.6,
												'fill': colorScale(d.lane)
										}))
										.call(_tooltip);

								rects
										.exit()
										.remove();
						}

				}
		}
}
