import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  axisBottom,
  axisLeft,
  axisRight,
  curveCardinal,
  scaleLinear,
} from "d3";

const Line = () => {
  const [data, setData] = useState([10, 52, 41, 86, 16, 35]);
  const svgRef = useRef();
  const width = 600;

  useEffect(() => {
    //this select ref should be inside useEffect as it will no render for the first time then
    const svg = d3.select(svgRef.current);

    //X Scale
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    //Y Scale
    const yScale = scaleLinear().domain([0, 86]).range([600, 0]);

    //x axis
    const xAxis = axisBottom(xScale).ticks(data.length);
    const yAxis = axisRight(yScale);

    svg.select(".x-axis").style("transform", "translateY(600px)").call(xAxis);

    svg.select(".y-axis").style("transform", "translateX(600px)").call(yAxis);

    //creating d attribute "M 100 1.5"
    const myLine = d3
      .line()
      .x((value, i) => xScale(i))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, []);

  console.log("hellfo");

  return (
    <svg
      style={{
        width: "600px",
        height: "600px",
        overflow: "visible",
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
      ref={svgRef}
    >
      <g className="x-axis"></g>
      <g className="y-axis"></g>
    </svg>
  );
};

export default Line;
