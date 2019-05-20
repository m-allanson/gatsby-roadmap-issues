require("dotenv").config();
const fetch = require("node-fetch");

// This setup is only needed once per application
async function fetchOneGraph(operationsDoc, operationName, variables) {
  const result = await fetch(
    `https://serve.onegraph.com/dynamic?app_id=${process.env.ONEGRAPH_APP_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ONEGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const operationsDoc = `
query GatsbyRoadmapIssues {
  gitHub {
    repository(name: "gatsby", owner: "gatsbyjs") {
      project(number: 8) {
        columns(first: 100) {
          nodes {
            purpose
            name
            resourcePath
            cards {
              nodes {
                content {
                  __typename
                  ... on GitHubIssue {
                    title
                    url
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                  }
                  ... on GitHubPullRequest {
                    title
                    url
                  }
                }
                url
                note
              }
            }
          }
        }
      }
    }
  }
}
`;

function fetchRoadmap() {
  return fetchOneGraph(operationsDoc, "GatsbyRoadmapIssues", {});
}

async function start() {
  const { errors, data } = await fetchRoadmap();

  if (errors) {
    // handle errors from OneGraph and various APIs
    console.error(errors);
  }

  // do something great with this precious data
  require(`./process`)(data);
}

start();
