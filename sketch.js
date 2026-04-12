const url = "https://api.sampleapis.com/codingresources/codingResources";
const container = document.getElementById("container");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const toggleBtn = document.getElementById("toggleTheme");

let allData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentPage = 1;
const itemsPerPage = 8;

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

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = data.slice(start, start + itemsPerPage);

  paginated.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.style.animationDelay = `${index * 0.05}s`;

    const fullText = item.description || "No Description Available";
    const link = item.url || "#";
    const title = fullText.split(".")[0];

    let website = "Unknown";
    try {
      website = new URL(link).hostname;
    } catch {}

    const isFav = favorites.includes(link);

    card.innerHTML = `
      <h3>${title}</h3>
      <p class="source">Source: ${website}</p>

      <div class="card-buttons">
        <button class="open-btn" onclick="openResource('${link}')">Open</button>

        <button class="fav" onclick="toggleFav('${link}')">
          ${isFav ? "★" : "☆"}
        </button>

        <button class="view" onclick="viewMore('${fullText}')">
          View
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  renderPagination(data.length);
}

function toggleFav(link) {
  if (favorites.includes(link)) {
    favorites = favorites.filter(i => i !== link);
  } else {
    favorites.push(link);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayData(allData);
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allData.filter(item =>
    (item.description || "").toLowerCase().includes(value)
  );

  currentPage = 1;
  displayData(filtered);
});

sortSelect.addEventListener("change", () => {
  let sorted = [...allData];

  if (sortSelect.value === "asc") {
    sorted.sort((a, b) => {
      const A = (a.description || "").toLowerCase();
      const B = (b.description || "").toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });
  }

  if (sortSelect.value === "desc") {
    sorted.sort((a, b) => {
      const A = (a.description || "").toLowerCase();
      const B = (b.description || "").toLowerCase();
      return A < B ? 1 : A > B ? -1 : 0;
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

  currentPage = 1;
  displayData(filtered);
});

function renderPagination(total) {
  const pages = Math.ceil(total / itemsPerPage);

  const nav = document.createElement("div");
  nav.className = "pagination";

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      currentPage = i;
      displayData(allData);
    };

    nav.appendChild(btn);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "pagination-wrapper";

  wrapper.appendChild(nav);
  container.appendChild(wrapper);
}

function viewMore(text) {
  alert(text);
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("light")) {
    toggleBtn.src = "sun.png";
  } else {
    toggleBtn.src = "moon.avif";
  }
});

function openResource(link) {
  window.open(link, "_blank");
}

fetchData();