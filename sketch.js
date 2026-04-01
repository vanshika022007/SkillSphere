const url = "https://api.sampleapis.com/codingresources/codingResources";

const container = document.getElementById("container");

function fetchData() {
  container.innerHTML = "<h2>Loading...</h2>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayData(data);
    })
    .catch(error => {
      container.innerHTML = "<h2>Error loading data</h2>";
      console.log(error);
    });
}

function displayData(data) {
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const title = item.description || "No Title";
    const link = item.url || "#";

    card.innerHTML = `
      <h3>${title}</h3>
      <button onclick="window.open('${link}', '_blank')">
        Open Resource
      </button>
    `;

    container.appendChild(card);
  });
}

fetchData();
