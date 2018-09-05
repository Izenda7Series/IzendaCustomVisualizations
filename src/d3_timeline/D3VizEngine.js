import {getClass} from 'IzendaSynergy';
import * as d3 from 'd3';
import 'd3-selection-multi';
import './styles.css';

const VizEngine = getClass('VizEngine');

export default class D3VizEngine extends VizEngine {

		draw(chartContainer, chartType, options, onCompleted) {
				if (chartType === 'timeline') {
						const {
								data: {
										lanes,
										items: data
								},
								fieldNameAlias,
								formats: {
										metric: metricFormat,
										range: rangeFormat
								},
								range: {
										timelineBegin,
										timelineEnd
								},
								scales: {
										x,
										x1,
										x2,
										y1,
										y2
								},
								styles: {
										colors,
										isShowTooltip,
										plotBgColor
								},
								fieldOptions: {
										groupOptions,
										metricOptions
								}
						} = options;

						const laneLength = lanes.length;

						const containerWidth = chartContainer.clientWidth;
						const containerHeight = chartContainer.clientHeight;

						const colorScale = d3
								.scaleOrdinal(colors)
								.domain(data.map(d => d.lane));

						const margin = [
										40, 10, 30, 140
								],
								width = containerWidth - margin[1] - margin[3],
								height = containerHeight - margin[0] - margin[2],
								miniHeight = laneLength * 8 + 20,
								mainHeight = height - miniHeight - 50,
								space = 20; //space between mini and main charts

						x.range([0, width]);
						x1.range([0, width]);
						y1.range([0, mainHeight]);
						y2.range([0, miniHeight]);
						x2.range([0, width]);

						const svg = d3
								.select(chartContainer)
								.append('svg')
								.styles({'shape-rendering': 'crispEdges'})
								.attr('width', width + margin[1] + margin[3])
								.attr('height', height + margin[0] + margin[2]);

						const plotArea = svg
								.append('rect')
								.attr('transform', `translate(${margin[3]},${margin[0]})`)
								.attr('width', width)
								.attr('height', height - margin[2])
								.classed('plot-area', true)
								.attr('fill', plotBgColor);

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
								.attr('height', mainHeight)
								.classed('main', true);

						const mini = svg
								.append('g')
								.attr('transform', `translate(${margin[3]},${ (mainHeight + margin[0] + space)})`)
								.attr('width', width)
								.attr('height', miniHeight)
								.classed('mini', true);

						const xAxisTopCall = d3
										.axisTop(x1)
										.tickFormat(d => rangeFormat
												? rangeFormat(d)
												: d)
										.tickSize(3)
										.ticks(8),
								xAxisBottomCall = d3
										.axisBottom(x)
										.tickFormat(d => rangeFormat
												? rangeFormat(d)
												: d)
										.ticks(8)
										.tickSize(3);

						const xAxis = svg
								.append("g")
								.classed("axis bottom", true)
								.attr("transform", `translate(${margin[3]},${height + space / 2})`)
								.call(xAxisBottomCall)
								.selectAll(".tick text")
								.style("text-anchor", "middle");

						//add a foreign object to attach html into svg
						let tickSizeInner = 6,
								tickPadding = 3,
								spacing = Math.max(tickSizeInner, 0) + tickPadding;
						// d3 		.selectAll('.tick') 		.insert("foreignObject")
						// 		.classed("foreign-object", true) 		.attr("width", d => {
						// 				console.log(d); 		}) 		.attr("height", 500) 		.attr("y", spacing)
						// 		.attr("dy", "0.71em") 		.append("xhtml:body") 		.style("font", "14px
						// 'Helvetica Neue'") 		.html("<span>An HTML Foreign Object in SVG</span>");

						svg
								.append("g")
								.classed("axis top", true)
								.attr("transform", `translate(${margin[3]},${margin[0] - 1})`)
								.call(xAxisTopCall)
								.selectAll("text")
								.style("text-anchor", "middle");

						svg
								.append("text")
								.attr("transform", `translate( ${containerWidth / 2},${ (height + margin[0] + 20)})`)
								.style("text-anchor", "middle")
								.classed("chart-label", true)
								.text(`${fieldNameAlias.startField} - ${fieldNameAlias.endField}`);

						svg
								.append("text")
								.attr("transform", "rotate(-90)")
								.attr("y", "30")
								.attr("x", -margin[3])
								//.attr("dy", "-1em")
								.style("text-anchor", "middle")
								.classed("chart-label", true)
								.text(`${fieldNameAlias.groupField}`);

						const tooltip = d3
								.select(chartContainer)
								.append('div')
								.classed('tooltip', true);

						//main lanes and texts
						main
								.append('g')
								.selectAll('.laneLines')
								.data(data)
								.enter()
								.append('line')
								.attr('x1', margin[1] - 10)
								.attr('y1', d => y1(d.lane))
								.attr('x2', width)
								.attr('y2', d => y1(d.lane))
								.attr('stroke', 'lightgray');

						svg
								.append('g')
								.classed('mainLaneTexts', true)
								.attr('transform', 'translate(' + margin[3] + ',' + margin[0] + ')')
								.selectAll('.laneText')
								.data(lanes)
								.enter()
								.append('text')
								.attr('x', -margin[1])
								.attr('y', (d, i) => y1(i + 0.5))
								.attr('dy', '.5ex')
								.attr('text-anchor', 'end')
								.style('font', '12px sans-serif')
								.attr('fill', (d) => {
										let itemInCellGroupColor = groupOptions.cellColors.value && groupOptions
												.cellColors
												.value
												.find(val => val.key === d);
										return itemInCellGroupColor
												? itemInCellGroupColor.text
												: '';
								})
								.text((d) => {
										let itemInOption = groupOptions.alternativeText.value && groupOptions
												.alternativeText
												.value
												.find(val => val.key === d);
										return itemInOption
												? itemInOption.text
												: d;
								});

						//mini lanes and texts
						mini
								.append('g')
								.selectAll('.laneLines')
								.data(data)
								.enter()
								.append('line')
								.attr('x1', margin[1] - 10)
								.attr('y1', d => y2(d.lane))
								.attr('x2', width)
								.attr('y2', d => y2(d.lane))
								.attr('stroke', 'lightgray');

						svg
								.append('g')
								.attr('transform', `translate(${margin[3]},${ (mainHeight + margin[0] + space)})`)
								.classed('miniLaneTexts', true)
								.selectAll('.laneText')
								.data(lanes)
								.enter()
								.append('text')
								.attr('x', -margin[1])
								.attr('y', (d, i) => y2(i + 0.5))
								.attr('dy', '.5ex')
								.attr('text-anchor', 'end')
								.style('font', '9px sans-serif')
								.attr('fill', (d, i) => {
										let itemInOption = groupOptions.cellColors.value && groupOptions
												.cellColors
												.value
												.find(val => val.key === d);
										return itemInOption
												? itemInOption.text
												: '';
								})
								.text((d) => {
										let itemInOption = (groupOptions.alternativeText.value && groupOptions.alternativeText.value.find(val => val.key === d)) || (groupOptions.alternativeText.rangeVale && groupOptions.alternativeText.rangeVale.find(val => val.from <= d && val.to >= d));
										return itemInOption
												? itemInOption.text
												: d;
								});

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
								.attr('stroke-width', 6)
								.attr('fill', d => {
										return d.fillColor
												? d.fillColor
												: colorScale(d.lane);
								});

						const brush = d3
								.brushX()
								.extent([
										[
												0, 0
										],
										[width, miniHeight]
								])
								.on('brush', brushed);

						mini
								.append('g')
								.attr('class', 'x brush')
								.call(brush)
								.selectAll('rect')
								.attr('y', 1)
								.attr('height', miniHeight - 1);

						//call brush default
						d3
								.select('.brush')
								.transition()
								.call(brush.move, [
										0, width / 3
								]);

						const _tooltip = function (selection) {
								const checkMetricAlterText = (d) => {
										const objInOption = (metricOptions.alternativeText.value && metricOptions.alternativeText.value.find(val => val.key === d.id)) || (metricOptions.alternativeText.rangeValue && metricOptions.alternativeText.rangeValue.find(val => val.from <= d.id && val.to >= d.id));

										return objInOption
												? objInOption.text
												: (metricFormat
														? metricFormat(d.id)
														: d.id);
								};
								const checkGroupAlterText = (d) => {
										const objInOption = groupOptions.alternativeText.value && groupOptions
												.alternativeText
												.value
												.find(val => val.key === d.laneName);
										return objInOption
												? objInOption.text
												: d.laneName;
								};
								if (!isShowTooltip) 
										return;
								selection.on('mouseover.tooltip', (d) => {
										const htmlTooltip = `<p class="text-name">${fieldNameAlias.groupField}: ${checkGroupAlterText(d)}</p><p>${fieldNameAlias.startField}: <span>${rangeFormat
												? rangeFormat(d.start)
												: d.start}</span></p><p>${fieldNameAlias.endField}: <span>${rangeFormat
														? rangeFormat(d.end)
														: d.end}</span></p><p>${fieldNameAlias.labelField}: <span>${checkMetricAlterText(d)}</span></p>`;

										tooltip
												.transition()
												.duration(200)
												.style("opacity", 0.9);
										tooltip
												.html(htmlTooltip)
												.style("left", `${d3.event.pageX + 5}px`)
												.style("top", `${d3.event.pageY + 5}px`);
								}).on('mousemove.tooltip', () => {
										tooltip
												.style("left", `${d3.event.pageX + 5}px`)
												.style("top", `${d3.event.pageY + 5}px`);
								}).on('mouseout.tooltip', () => {
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
								if (!selection) 
										return;
								
								// calculate the new range and filter data which belongs to new range.
								let timeSelection = selection.map(x.invert),
										minExtent = timeSelection[0],
										maxExtent = timeSelection[1],
										visItems = data.filter(d => d.start < maxExtent && d.end > minExtent);

								//update domain for main axis
								x1.domain([minExtent, maxExtent]);

								//call axis top to update with new domain
								svg
										.select('.axis.top')
										.transition()
										.call(xAxisTopCall);

								// select all main rects and bind data to them
								let rects = itemRects
										.selectAll('rect')
										.data(visItems, d => d.id);

								//remove surplus rects
								rects
										.exit()
										.remove();

								// add new rect and create a new selection, merge the new and the existing rects
								// and update attributes for the merged selection
								rects = rects
										.enter()
										.append('rect')
										.merge(rects)
										.attr('x', d => x1(d.start))
										.attr('y', d => y1(d.lane) + 3)
										.attr('width', d => x1(d.end) - x1(d.start) || 0)
										.attr('height', d => y1(1) - 6)
										.styles(d => ({
												'stroke-width': 6,
												'fill': () => {
														return d.fillColor
																? d.fillColor
																: colorScale(d.lane);
												}
										}))
										.call(_tooltip);
						}
				}
		}
}
