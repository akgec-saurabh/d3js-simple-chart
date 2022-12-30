import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Msarea.scss";
import { axisBottom, axisLeft, axisRight, axisTop } from "d3";
const Msarea = () => {
  const svgRef = useRef();

  // Fake data
  const data = [
    {
      year: 7,
      aData: 50,
      bData: 300,
      cData: 456,
    },
    {
      year: 8,
      aData: 150,
      bData: 50,
      cData: 100,
    },
    {
      year: 9,
      aData: 200,
      bData: 100,
      cData: 156,
    },
    {
      year: 10,
      aData: 130,
      bData: 50,
      cData: 56,
    },
    {
      year: 11,
      aData: 240,
      bData: 80,
      cData: 576,
    },
    {
      year: 12,
      aData: 380,
      bData: 10,
      cData: 356,
    },
    {
      year: 13,
      aData: 420,
      bData: 200,
      cData: 246,
    },
  ];
  const width = 1200;
  const height = 600;
  const ticks = 8;

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    //! MAIN PART STACKING !//
    //* https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca
    //* https://github.com/d3/d3-shape#stack
    //* https://d3-graph-gallery.com/graph/area_basic.html

    const stack = d3.stack().keys(["aData", "bData", "cData"]);
    // .order(d3.stackOrderNone);
    // .offset(d3.stackOrderNone);

    const stackValue = stack(data);
    // console.log(stackValue);

    const stackData = [];

    stackValue.forEach((layer, index) => {
      const currentStack = [];
      layer.forEach((d, i) => {
        currentStack.push({
          value: d,
          year: data[i].year,
        });
      });
      stackData.push(currentStack);
    });
    console.log(stackData);

    //! -------------------!//

    //X Scale
    const xScale = d3.scaleLinear().domain([7, 13]).range([0, width]);
    // X Axis
    const xAxis = d3.axisBottom(xScale).ticks(data.length - 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${height}px)`)
      .call(xAxis);

    //Y Scale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackValue[stackValue.length - 1], (dp) => dp[1])])
      .range([height, 0]);
    //Y Axis
    const yAxis = axisLeft(yScale).ticks(ticks);
    svg.select(".y-axis").call(yAxis);

    //XGRID
    const xGrid = axisTop(xScale)
      .ticks(ticks)
      .tickSize(-height)
      .tickFormat(" ");
    svg.select(".x-axis-grid").call(xGrid);

    //YGRID
    const yGrid = axisLeft(yScale)
      .ticks(data.length - 1)
      .tickSize(-width)
      .tickFormat(" ");
    svg.select(".y-axis-grid").call(yGrid);

    const area = d3
      .area()
      .x((d) => xScale(d.year))
      .y0((d) => yScale(d.value[0]))
      .y1((d) => yScale(d.value[1]));

    console.log(area(stackData[0]));

    const color = d3
      .scaleOrdinal()
      .domain([0, 1])
      .range(["#5c497e", "#7c6d97", "#e0cefe"]);

    // Show the areas
    svg
      .selectAll(".les")
      .data(stackData)
      .join("path")
      .attr("stroke", "white")
      .attr("class", (d, i) => `arrow${i}`)
      .style("fill", (d, i) => color(i))
      .attr("d", area);
  }, []);
  return (
    <svg ref={svgRef}>
      <g className="x-axis"></g>
      <g className="y-axis"></g>
      <g className="x-axis-grid"></g>
      <g className="y-axis-grid"></g>
    </svg>
  );
};

export default Msarea;
