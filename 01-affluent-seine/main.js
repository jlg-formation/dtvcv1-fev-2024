// @ts-nocheck
const main = async () => {
  const csv = await d3.dsv(",", "./query.csv");

  const button = document.querySelector("button.switch");

  const getSource = (csv, state) => {
    const source = csv.map((line) => [line.riverLabel, line[state]]);
    source.sort((a, b) => {
      return Math.sign(b[1] - a[1]);
    });
    return source;
  };

  let state = "length";
  button.addEventListener("click", () => {
    state = state === "length" ? "debit" : "length";
    const source = getSource(csv, state);
    console.log("source: ", source);
    button.innerHTML =
      state === "length" ? "Voir les débits" : "Voir les longueurs";

    d3.select("p.unit").text(
      state === "length" ? "Longueur en km" : "Debit en m3/s"
    );
    update(source, state);
  });

  const update = (source, state) => {
    console.log("state: ", state);
    const height = 1.8;
    const duration = 1000;
    const coef = state === "length" ? 1 : 3;

    const backgroundColor = state === "length" ? "tomato" : "green";

    d3.select("div.content")
      .selectAll("div.name")
      .data(source, (d) => d[0])
      .join("div")
      .classed("name", true)
      .text((d) => d[0])
      .transition()
      .duration(duration)
      .style("top", (d, i) => `${i * height}em`);

    d3.select("div.content")
      .selectAll("div.bar")
      .data(source, (d) => d[0])
      .join("div")
      .classed("bar", true)
      .text((d) => d[1])
      .transition()
      .duration(duration)
      .style("background-color", backgroundColor)
      .style("top", (d, i) => `${i * height}em`)
      .style("width", (d) => `${(d[1] * coef) / 16}em`);
  };

  const source = getSource(csv, state);
  update(source, state);
};

main();
