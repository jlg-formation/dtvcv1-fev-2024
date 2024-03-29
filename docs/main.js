// @ts-nocheck
const main = async () => {
  const duration = 1000;

  const query = `
  #Affluent de la Seine
  SELECT ?river ?riverLabel ?length ?debit
  WHERE
  {
    ?river wdt:P403 wd:Q1471. # se jette dans la seine
    ?river wdt:P2043 ?length. # a pour longueur
    ?river wdt:P2225 ?debit. # a pour debit
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } # Helps get the label in your language, if not, then en language
  }
  ORDER BY DESC(?length)
`;

  wikidataUrl = "https://query.wikidata.org/bigdata/namespace/wdq/sparql";
  const url = wikidataUrl + "?query=" + encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
    },
  });
  const json = await response.json();
  const csv = json.results.bindings.map((row) => {
    const result = {};
    for (const key of Object.keys(row)) {
      result[key] = row[key].value;
    }
    return result;
  });
  console.log("csv: ", csv);

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

    d3.select("p.unit")
      .style("opacity", 0)
      .text(state === "length" ? "Longueur en km" : "Débit en m3/s")
      .transition()
      .duration(duration)
      .style("opacity", 1);

    update(source, state);
  });

  const update = (source, state) => {
    console.log("state: ", state);
    const height = 1.8;

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
      .html("&nbsp;")
      .transition()
      .duration(duration)
      .style("background-color", backgroundColor)
      .style("color", backgroundColor)
      .style("top", (d, i) => `${i * height}em`)
      .style("width", (d) => `${(d[1] * coef) / 16}em`);

    d3.select("div.content")
      .selectAll("div.textbar")
      .data(source, (d) => d[0])
      .join("div")
      .classed("textbar", true)
      .style("opacity", 0)
      .transition()
      .duration(duration)
      .text((d) => d[1])
      .style("opacity", 1)
      .style("top", (d, i) => `${i * height}em`)
      .style("left", (d, i) =>
        d[1] * coef < 30 ? `${10.5 + 0.5 + (d[1] * coef) / 16}em` : "10.5em"
      )
      .style("color", (d, i) => (d[1] * coef < 30 ? `black` : "white"))
      .style("width", (d) => `${(d[1] * coef) / 16}em`);
  };

  const source = getSource(csv, state);
  update(source, state);
};

main();
