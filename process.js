const fs = require(`fs`);
const _ = require(`lodash`);
const { convertArrayToCSV } = require("convert-array-to-csv");

const labelMap = {
  "impact: high": 1,
  "impact: med": 2,
  "impact: low": 3,
  "effort: high": 3,
  "effort: med": 2,
  "effort: low": 1
};

const labelToInt = label => labelMap[label && label.name] || 0;

module.exports = data => {
  // fs.writeFileSync(`./data.json`, JSON.stringify(data));
  let items = [];
  const columns = data.gitHub.repository.project.columns;

  columns.nodes.forEach(column => {
    if (column.name === `Done`) return;
    // console.log(column.name);

    const tasks = column.cards.nodes;
    tasks.forEach(node => {
      let line = [];
      if (!node.content || !node.content.title) return;

      let impactValue, effortValue;
      if (node.content.labels && node.content.labels.nodes) {
        const labelNodes = node.content.labels.nodes;
        impactValue = labelToInt(
          labelNodes.find(label => label.name.startsWith("impact: "))
        );
        effortValue = labelToInt(
          labelNodes.find(label => label.name.startsWith("effort: "))
        );
      }
      line = [
        node.content.url,
        node.content.title,
        column.name,
        impactValue || 0,
        effortValue || 0
      ];
      // console.log(line);
      items.push(line);
    });
  });

  console.log(convertArrayToCSV(items));
};

// const data = JSON.parse(fs.readFileSync(`./data.json`));
// module.exports(data);
