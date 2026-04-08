const url = "https://api.sampleapis.com/codingresources/codingResources";
const container = document.getElementById("container");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const toggleBtn = document.getElementById("toggleTheme");

let allData = [];       
let favorites = [];     

function fetchData() {
  container.innerHTML = "<h2>Loading resources...</h2>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      allData = data;        
      setupFilter(data);     
      displayData(data);
    })
    .catch(error => {
      container.innerHTML = "<h2>Error loading data</h2>";
      console.log(error);
    });
}

function displayData(data) {
  container.innerHTML = "";

  data.forEach((item, index) => {   
    const card = document.createElement("div");
    card.className = "card";

    const fullText = item.description || "No Description Available";
    const link = item.url || "#";

    const title = fullText.split(".")[0];

    let website = "Unknown";
    try {
      website = new URL(link).hostname;
    } catch {}

    const isFav = favorites.includes(index);  

    card.innerHTML = `
      <h3>${title}</h3>
      <p class="source">Source: ${website}</p>

      <button class="open-btn" title="Open learning resource" onclick="openResource('${link}')">
        Open
      </button>

      <button class="fav" onclick="toggleFav(${index})">
        ${isFav ? "★" : "☆"}
      </button>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allData.filter(item =>
    (item.description || "").toLowerCase().includes(value)
  );

  displayData(filtered);
});

sortSelect.addEventListener("change", () => {
  let sorted = [...allData];

  if (sortSelect.value === "asc") {
    sorted.sort((a, b) => {
      const A = (a.description || "").toLowerCase();
      const B = (b.description || "").toLowerCase();
      if (A > B) return 1;
      if (A < B) return -1;
      return 0;
    });
  }

  if (sortSelect.value === "desc") {
    sorted.sort((a, b) => {
      const A = (a.description || "").toLowerCase();
      const B = (b.description || "").toLowerCase();
      if (A < B) return 1;
      if (A > B) return -1;
      return 0;
    });
  }

  displayData(sorted);
});

function setupFilter(data) {
  const sites = data.map(item => {
    try {
      return new URL(item.url).hostname;
    } catch {
      return "Unknown";
    }
  });

  const unique = [...new Set(sites)];

  unique.forEach(site => {
    const option = document.createElement("option");
    option.value = site;
    option.textContent = site;
    filterSelect.appendChild(option);
  });
}

filterSelect.addEventListener("change", () => {
  const val = filterSelect.value;

  if (val === "") {
    displayData(allData);
    return;
  }

  const filtered = allData.filter(item => {
    try {
      return new URL(item.url).hostname === val;
    } catch {
      return false;
    }
  });

  displayData(filtered);
});

/* ⭐ FAVORITE (NEW) */
function toggleFav(index) {
  if (favorites.includes(index)) {
    favorites = favorites.filter(i => i !== index);
  } else {
    favorites.push(index);
  }

  displayData(allData);
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
});

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
