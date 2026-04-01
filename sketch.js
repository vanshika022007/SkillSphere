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

    const fullText = item.description || "No Title";
    const link = item.url || "#";

    const title = fullText.split(".")[0];

    let website = "Unknown";
    try {
      website = new URL(link).hostname;
    } catch {}

    card.innerHTML = `
      <h3>${title}</h3>
      <p class="source">Source: ${website}</p>
      <button onclick="openResource('${link}')">
        Open Resource
      </button>
    `;

    container.appendChild(card);
  });
}

function openResource(link) {
  try {
    const newTab = window.open(link, "_blank");

    if (!newTab) {
      alert("This resource could not be opened.");
    }
  } catch (error) {
    alert("Invalid or broken link.");
  }
}

fetchData();