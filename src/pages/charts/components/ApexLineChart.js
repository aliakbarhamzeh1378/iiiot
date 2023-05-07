import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

export default function ApexLineChart(props) {
  let categories_data = props.categories
  let series_data = props.series
  const [series, setSeries] = useState([
    { name: "humidity", data: [] },
    { name: "Temperature", data: [] },
    { name: "Soil moisture", data: [] },
    { name: "Light", data: [] },
  ]);
  const [categories, setCategories] = useState([]);
  const [selectedArea, setSelectedArea] = useState({
    xaxis: {
      min: 1,
      max: 2,
    },
    yaxis: {
      min: 2,
      max: 1,
    },
  });
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    // Code to run when the data prop changes
    // ...
    setCategories(categories_data);
    setSeries(series_data);
  }, [series_data]);

  const options = {
    chart: {
      id: "realtime",
          type: 'rangeBar', // set chart type to 'rangeBar'

      events: {
        selection: function (chartContext, { xaxis, yaxis }) {
          // event handler function code here
          console.log('jkjjkjkjk')
        }
      },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
      },

    },
    xaxis: {
      categories: categories,
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
  };

  return (
  <div>
      <ApexCharts
      options={options}
      series={series}
      type="area"
      height={350}
    />
  <h1>
  </h1>
  </div>
  );
}
