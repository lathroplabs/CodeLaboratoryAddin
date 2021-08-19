import React, { useContext } from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { scatterBasic } from "../../chartConfigs/scatter";
import { lineBasic } from "../../chartConfigs/line";
import { barBasic, barHorizontal, barStacked, barGrouped } from "../../chartConfigs/bar";
import { stackedArea } from "../../chartConfigs/area";
import { basicPie, donut } from "../../chartConfigs/pie";
import { basicBoxPlot, boxPlotWithData } from "../../chartConfigs/box";


export default function ChartTypeDropdown({setChartTemplate}) {
  
  const templates = {
    "ScatterBasic": scatterBasic,
    "LineBasic": lineBasic,
    "BarBasic": barBasic,
    "BarHorizontal": barHorizontal,
    "BarStacked": barStacked,
    "BarGrouped": barGrouped,
    "StackedArea": stackedArea,
    "BasicPie": basicPie,
    "Donut": donut,
    "BoxPlot": basicBoxPlot,
    "BoxPlotWithData": boxPlotWithData,
  };

  const chartTypeOptions = [
    { key: "ScatterBasic", text: "Basic Scatter Plot" },
    { key: "LineBasic", text: "Basic Line Plot" },
    { key: "BarBasic", text: "Basic Bar Plot" },
    { key: "BarHorizontal", text: "Horizontal Bar Plot" },
    { key: "BarStacked", text: "Stacked Bar Plot" },
    { key: "BarGrouped", text: "Grouped Bar Plot" },
    { key: "StackedArea", text: "Stacked Area Plot" },
    { key: "BasicPie", text: "Basic Pie Chart" },
    { key: "Donut", text: "Donut Chart" },
    { key: "BoxPlot", text: "Basic Box Plot" },
    { key: "BoxPlotWithData", text: "Box Plot With Data" },
  ];

  return (
    <div id="chart-type-dropdown">
      <Dropdown
        placeholder="Select Chart"
        label="Select a Chart Type"
        options={chartTypeOptions}
        onChange={handleChoice}
        required={true}
      />
    </div>
  );

  function handleChoice(ev, option) {
    const chartTypeKey = option["key"];
    const chartTemp = templates[chartTypeKey]
    setChartTemplate(chartTemp)
    
  }
}
