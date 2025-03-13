document.addEventListener("DOMContentLoaded", () => {
    let video = document.getElementById("bg-video");
    let fallbackImage = document.getElementById("fallback-image");

    video.onerror = () => {
        console.warn("Video could not be loaded, displaying fallback image.");
        video.style.display = "none";
        fallbackImage.style.display = "block";
    };

    // Get UI elements
    const searchContainer = document.getElementById("search-container");
    const resultsContainer = document.getElementById("results-container");
    const resultsDiv = document.getElementById("results");

    // Planet count controls
    let planetCountInput = document.getElementById("planetCount");
    let increaseBtn = document.getElementById("increase");
    let decreaseBtn = document.getElementById("decrease");

    increaseBtn.addEventListener("click", () => {
        planetCountInput.value = parseInt(planetCountInput.value) + 1;
    });

    decreaseBtn.addEventListener("click", () => {
        if (planetCountInput.value > 1) {
            planetCountInput.value = parseInt(planetCountInput.value) - 1;
        }
    });

    // Validate manual input
    planetCountInput.addEventListener("input", () => {
        if (planetCountInput.value < 1 || isNaN(planetCountInput.value)) {
            planetCountInput.value = 1;
        }
    });

    function updateSystemInfo(results) {
        let totalStars = 0;
        let totalPlanets = 0;

        results.forEach(system => {
            if (system.bodies) {
                totalStars += system.bodies.filter(body => body.type === "Star").length;
                totalPlanets += system.bodies.filter(body => body.type === "Planet").length;
            }
        });

        document.getElementById("sun-count").textContent = totalStars;
        document.getElementById("planet-count").textContent = totalPlanets;
    }

    // Search logic
    document.getElementById('searchBtn').addEventListener('click', () => {
        let checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        let activeFilters = [];

        checkboxes.forEach(box => {
            if (box.checked) {
                activeFilters.push(box.value);
            }
        });

        let minPlanets = parseInt(document.getElementById("planetCount").value);

        let warningMessage = document.getElementById("warning-message");
        if (!warningMessage) {
            warningMessage = document.createElement("p");
            warningMessage.id = "warning-message";
            warningMessage.classList.add("warning-text");
            document.getElementById("search-container").appendChild(warningMessage);
        }

        if (activeFilters.length === 0) {
            warningMessage.textContent = "⚠️ Choose at least 1 option!";
            warningMessage.style.display = "block";
            return;
        } else {
            warningMessage.style.display = "none";
        }

        fetch(`http://127.0.0.1:5000/search?filters=${encodeURIComponent(activeFilters.join(','))}&minPlanets=${minPlanets}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);

                resultsDiv.innerHTML = "";
                updateSystemInfo(data.results);

                if (data.results.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found.</p>";
                } else {
                    data.results.forEach(system => {
                        if (!system.name || !system.coords) {
                            console.warn("System without name or coordinates:", system);
                            return;
                        }

                        let resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");

                        let textContainer = document.createElement("div");
                        textContainer.classList.add("result-text-container");

                        let systemName = document.createElement("div");
                        systemName.classList.add("result-text");
                        systemName.textContent = system.name;

                        let distanceText = document.createElement("div");
                        distanceText.classList.add("sol-distance");
                        distanceText.textContent = `Distance from Sol: ${system.distance_from_sol} LY`;

                        // Count stars and planets
                        let starCount = system.bodies ? system.bodies.filter(body => body.type === "Star").length : 0;
                        let planetCount = system.bodies ? system.bodies.filter(body => body.type === "Planet").length : 0;

                        let countInfo = document.createElement("div");
                        countInfo.classList.add("result-count-icon-info");

                        let starIcon = document.createElement("img");
                        starIcon.src = "http://127.0.0.1:5000/icons/star_ico.png";
                        starIcon.classList.add("result-count-icon");

                        let starCountText = document.createElement("span");
                        starCountText.textContent = `${starCount}`;

                        let planetIcon = document.createElement("img");
                        planetIcon.src = "http://127.0.0.1:5000/icons/planet_ico.png";
                        planetIcon.classList.add("result-count-icon");

                        let planetCountText = document.createElement("span");
                        planetCountText.textContent = `${planetCount}`;

                        // Append icons and counts
                        countInfo.appendChild(starIcon);
                        countInfo.appendChild(starCountText);
                        countInfo.appendChild(planetIcon);
                        countInfo.appendChild(planetCountText);

                        textContainer.appendChild(systemName);
                        textContainer.appendChild(distanceText);
                        textContainer.appendChild(countInfo);

                        let icon = document.createElement("img");
                        icon.classList.add("result-icon");

                        if (system.bodies && system.bodies.some(body => body.type === "Star")) {
                            icon.src = "http://127.0.0.1:5000/icons/star.png";
                        } else if (system.bodies && system.bodies.some(body => body.type === "Planet")) {
                            icon.src = "http://127.0.0.1:5000/icons/planet_ico.png";
                        } else {
                            icon.src = "http://127.0.0.1:5000/icons/default.png";
                        }

                        let copyBtn = document.createElement("button");
                        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                        copyBtn.classList.add("result-button");
                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(system.name);
                            alert("Copied to clipboard: " + system.name);
                        };

                        let viewBtn = document.createElement("button");
                        viewBtn.innerHTML = '<i class="fa-solid fa-globe"></i>';
                        viewBtn.classList.add("result-button");
                        viewBtn.onclick = () => {
                            window.open(`https://www.edsm.net/en/system?systemName=${encodeURIComponent(system.name)}`, "_blank");
                        };

                        let buttonContainer = document.createElement("div");
                        buttonContainer.classList.add("button-container");
                        buttonContainer.appendChild(copyBtn);
                        buttonContainer.appendChild(viewBtn);

                        resultItem.appendChild(icon);
                        resultItem.appendChild(textContainer);
                        resultItem.appendChild(buttonContainer);
                        resultsDiv.appendChild(resultItem);
                    });
                }

                resultsContainer.classList.add("visible");
            })
            .catch(err => {
                console.error("Search error:", err);
            });
    });
});
