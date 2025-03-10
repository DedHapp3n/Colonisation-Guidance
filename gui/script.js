document.addEventListener("DOMContentLoaded", () => {
    let video = document.getElementById("bg-video");
    let fallbackImage = document.getElementById("fallback-image");

    video.onerror = () => {
        console.warn("Video konnte nicht geladen werden, zeige Fallback-Bild.");
        video.style.display = "none";
        fallbackImage.style.display = "block";
    };

    // Seiten-Elemente
    const searchContainer = document.getElementById("search-container");
    const resultsContainer = document.getElementById("results-container");
    const resultsDiv = document.getElementById("results");

    // Mindestanzahl Planeten Steuerung
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

    // Manuelle Eingabe absichern
    planetCountInput.addEventListener("input", () => {
        if (planetCountInput.value < 1 || isNaN(planetCountInput.value)) {
            planetCountInput.value = 1;
        }
    });

    // Such-Logik mit Checkboxen
    document.getElementById('searchBtn').addEventListener('click', () => {
        let checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        let activeFilters = [];

        checkboxes.forEach(box => {
            if (box.checked) {
                activeFilters.push(box.value);
            }
        });

        // Falls keine Filter gesetzt wurden, keine Ergebnisse anzeigen
        if (activeFilters.length === 0) {
            resultsContainer.classList.remove("visible");
            resultsDiv.innerHTML = "";
            return;
        }

        let minPlanets = parseInt(planetCountInput.value);

        fetch(`http://127.0.0.1:5000/search?filters=${encodeURIComponent(activeFilters.join(','))}&minPlanets=${minPlanets}`)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = ""; // Vorherige Ergebnisse löschen

                if (data.results.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found.</p>";
                } else {
                    data.results.forEach(item => {
                        let resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");

                        // Icon hinzufügen
                        let icon = document.createElement("img");
                        icon.classList.add("result-icon");

                        // Falls du verschiedene Icons für verschiedene Typen möchtest:
                        if (item.includes("star")) {
                            icon.src = "http://127.0.0.1:5000/icons/star.png";
                        } else if (item.includes("planet")) {
                            icon.src = "http://127.0.0.1:5000/icons/planet.png";
                        } else {
                            icon.src = "http://127.0.0.1:5000/icons/default.png";
                        }

                        // Text hinzufügen
                        let text = document.createElement("div");
                        text.classList.add("result-text");
                        text.textContent = item;

                        // Elemente zusammenfügen
                        resultItem.appendChild(icon);
                        resultItem.appendChild(text);
                        resultsDiv.appendChild(resultItem);

                    let copyBtn = document.createElement("button");
                    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                    copyBtn.classList.add("result-button");
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(item);
                        alert("Copied to clipboard: " + item);
                    };

                    // Link-Button (Globus-Icon)
                    let viewBtn = document.createElement("button");
                    viewBtn.innerHTML = '<i class="fa-solid fa-globe"></i>';
                    viewBtn.classList.add("result-button");
                    viewBtn.onclick = () => {
                        window.open(`https://www.edsm.net/en/system?systemName=${encodeURIComponent(item)}`, "_blank");
                    };

                    // Buttons in einen Container packen
                    let buttonContainer = document.createElement("div");
                    buttonContainer.classList.add("button-container");
                    buttonContainer.appendChild(copyBtn);
                    buttonContainer.appendChild(viewBtn);

                    // Buttons zum Ergebnis hinzufügen
                    resultItem.appendChild(buttonContainer);


                    });
                }

                // Zeige das Ergebnis-Panel neben dem Setup-Panel
                resultsContainer.classList.add("visible");
            })
            .catch(err => {
                console.error('Error fetching search results:', err);
            });
    });
});
