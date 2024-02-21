/** @type HTMLElement | null */
const chartDom = document.querySelector("div.content");
if (chartDom === null) {
  throw new Error("div.content not found");
}

const source = [
  ["name", "longueur"],
  ["Marne", 514],
  ["Oise", 341.1],
  ["Yonne", 292.3],
  ["Aube", 248.3],
  ["Eure", 228.7],
  ["Risle", 145],
  ["Loing", 142.7],
  ["Epte", 113],
  ["Ource", 100.4],
  ["Yerres", 97.5],
  ["Essonne", 97.1],
  ["Andelle", 56.8],
  ["Barse", 50.1],
  ["Orge", 50.1],
  ["Voulzie", 43.9],
  ["Almont", 42.1],
  ["Orvin", 38.1],
];
const myChart = echarts.init(chartDom);
const option = {
  dataset: {
    source: [
      ["score", "amount", "product"],
      [89.3, 58212, "Matcha Latte"],
      [57.1, 78254, "Milk Tea"],
      [74.4, 41032, "Cheese Cocoa"],
      [50.1, 12755, "Cheese Brownie"],
      [89.7, 20145, "Matcha Cocoa"],
      [68.1, 79146, "Tea"],
      [19.6, 91852, "Orange Juice"],
      [10.6, 101852, "Lemon Juice"],
      [32.7, 20112, "Walnut Brownie"],
    ],
  },
  grid: { containLabel: true },
  xAxis: { name: "amount" },
  yAxis: { type: "category" },
  visualMap: {
    orient: "horizontal",
    left: "center",
    min: 10,
    max: 100,
    text: ["High Score", "Low Score"],
    // Map the score column to color
    dimension: 0,
    inRange: {
      color: ["#65B581", "#FFCE34", "#FD665F"],
    },
  },
  series: [
    {
      type: "bar",
      encode: {
        // Map the "amount" column to X axis.
        x: "amount",
        // Map the "product" column to Y axis
        y: "product",
      },
    },
  ],
};

option && myChart.setOption(option);
