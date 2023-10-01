import { merge } from "lodash";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexChartsOption } from "src/components/Charts/Apexcharts";
import { useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";

// ----------------------------------------------------------------------

const SaleColumnChart = () => {
  const { saleListAdmin } = useSelector((state) => state.product);

  const totals = [];
  const months = [];

  const d = saleListAdmin.map((sale, index) => {
    return {
      month: moment(sale.date).format("MMMM"),
      total: sale.total,
    };
  });

  let data = _(d)
    .groupBy("month")
    .map((objs, key) => {
      return {
        month: key,
        total: _.sumBy(objs, "total"),
      };
    })
    .value();

  data.map((item, index) => {
    totals.push(item.total);
    months.push(item.month);
  })

  const CHART_DATA = [
    { name: "Total", data: totals },
  ];

  const chartOptions = merge(ApexChartsOption(), {
    plotOptions: { bar: { columnWidth: "14%", endingShape: "rounded" } },
    stroke: { show: false },
    xaxis: {
      categories: months,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val;
        },
      },
    },
  });

  return (
    <ReactApexChart
      type="bar"
      series={CHART_DATA}
      options={chartOptions}
      height={320}
    />
  );
};

export default SaleColumnChart;
