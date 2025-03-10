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

    function updateSystemInfo(results) {
        let totalStars = 0;
        let totalPlanets = 0;

        results.forEach(system => {
            if (system.bodies) {  // Sicherstellen, dass bodies existiert
                totalStars += system.bodies.filter(body => body.type === "Star").length;
                totalPlanets += system.bodies.filter(body => body.type === "Planet").length;
            }
        });

        document.getElementById("sun-count").textContent = totalStars;
        document.getElementById("planet-count").textContent = totalPlanets;
    }

    // Such-Logik mit Checkboxen
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
                warningMessage.style.display = "none"; // Warnung ausblenden, wenn eine Auswahl getroffen wurde
            }
        fetch(`http://127.0.0.1:5000/search?filters=${encodeURIComponent(activeFilters.join(','))}&minPlanets=${minPlanets}`)
            .then(response => response.json())
            .then(data => {
                console.log("Empfangene Daten:", data);  // Debugging: Zeigt die empfangenen Daten in der Konsole

                resultsDiv.innerHTML = ""; // Vorherige Ergebnisse löschen
                updateSystemInfo(data.results); // System-Info aktualisieren

                if (data.results.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found.</p>";
                } else {
                    data.results.forEach(system => {
                        if (!system.name) {
                            console.warn("System without Name:", system);
                            return; // No Sys name = scip
                        }

                        let resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");

                        let text = document.createElement("div");
                        text.classList.add("result-text");
                        text.textContent = system.name; // Name des Systems hinzufügen

                        // Icon bestimmen basierend auf dem System
                        let icon = document.createElement("img");
                        icon.classList.add("result-icon");

                        if (system.bodies && system.bodies.some(body => body.type === "Star")) {
                            icon.src = "http://127.0.0.1:5000/icons/star.png";
                        } else if (system.bodies && system.bodies.some(body => body.type === "Planet")) {
                            icon.src = "http://127.0.0.1:5000/icons/planet_ico.png";
                        } else {
                            icon.src = "http://127.0.0.1:5000/icons/default.png";
                        }

                        resultItem.appendChild(icon);
                        resultItem.appendChild(text);
                        resultsDiv.appendChild(resultItem);
                    });
                }

                resultsContainer.classList.add("visible"); // Ergebnisbereich anzeigen
            })
            .catch(err => {
                console.error("Fehler bei der Suche:", err);
            });
    });
});
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

    function updateSystemInfo(results) {
        let totalStars = 0;
        let totalPlanets = 0;

        results.forEach(system => {
            if (system.bodies) {  // Sicherstellen, dass bodies existiert
                totalStars += system.bodies.filter(body => body.type === "Star").length;
                totalPlanets += system.bodies.filter(body => body.type === "Planet").length;
            }
        });

        document.getElementById("sun-count").textContent = totalStars;
        document.getElementById("planet-count").textContent = totalPlanets;
    }

    // Such-Logik mit Checkboxen
    document.getElementById('searchBtn').addEventListener('click', () => {
        let checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        let activeFilters = [];

        checkboxes.forEach(box => {
            if (box.checked) {
                activeFilters.push(box.value);
            }
        });

        let minPlanets = parseInt(document.getElementById("planetCount").value);

        fetch(`http://127.0.0.1:5000/search?filters=${encodeURIComponent(activeFilters.join(','))}&minPlanets=${minPlanets}`)
        .then(response => response.json())
        .then(data => {
            console.log("Empfangene Daten:", data);  // Debugging: Zeigt die empfangenen Daten in der Konsole
    
            resultsDiv.innerHTML = ""; // Vorherige Ergebnisse löschen
            updateSystemInfo(data.results); // Gesamtzahlen für alle Systeme aktualisieren
    
            if (data.results.length === 0) {
                resultsDiv.innerHTML = "<p>No results found.</p>";
            } else {
                data.results.forEach(system => {
                    if (!system.name) {
                        console.warn("System ohne Namen:", system);
                        return; // Falls der Name fehlt, überspringen
                    }
    
                    let sunCount = system.bodies ? system.bodies.filter(body => body.type === "Star").length : 0;
                    let planetCount = system.bodies ? system.bodies.filter(body => body.type === "Planet").length : 0;
    
                    let resultItem = document.createElement("div");
                    resultItem.classList.add("result-item");
    
                    // **Systemname-Bereich**
                    let textContainer = document.createElement("div");
                    textContainer.classList.add("result-text-container");
    
                    let systemName = document.createElement("div");
                    systemName.classList.add("result-text");
                    systemName.textContent = system.name; // Name des Systems
    
                    // **Sun & Planet Count mit Bildern**
                    let countInfo = document.createElement("div");
                    countInfo.classList.add("result-count-icon-info");
    
                    let sunIcon = document.createElement("img");
                    sunIcon.src = "http://127.0.0.1:5000/icons/star_ico.png";
                    sunIcon.classList.add("result-count-icon");
    
                    let sunCountText = document.createElement("span");
                    sunCountText.textContent = sunCount;
    
                    let planetIcon = document.createElement("img");
                    planetIcon.src = "http://127.0.0.1:5000/icons/planet_ico.png";
                    planetIcon.classList.add("result-count-icon");
    
                    let planetCountText = document.createElement("span");
                    planetCountText.textContent = planetCount;
    
                    // Icons + Total Count of Suns + Planet
                    countInfo.appendChild(sunIcon);
                    countInfo.appendChild(sunCountText);
                    countInfo.appendChild(planetIcon);
                    countInfo.appendChild(planetCountText);
    
                    textContainer.appendChild(systemName);
                    textContainer.appendChild(countInfo);
    
                    // **Icon für das System**
                    let icon = document.createElement("img");
                    icon.classList.add("result-icon");
    
                    if (sunCount > 0) {
                        icon.src = "http://127.0.0.1:5000/icons/star.png";
                    } else if (planetCount > 0) {
                        icon.src = "http://127.0.0.1:5000/icons/planet_ico.png";
                    } else {
                        icon.src = "http://127.0.0.1:5000/icons/default.png";
                    }
    
                    // **Buttons für Kopieren & Öffnen**
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
    
                    // **Container für Buttons**
                    let buttonContainer = document.createElement("div");
                    buttonContainer.classList.add("button-container");
                    buttonContainer.appendChild(copyBtn);
                    buttonContainer.appendChild(viewBtn);
    
                    // **Alle Elemente zusammenfügen**
                    resultItem.appendChild(icon);
                    resultItem.appendChild(textContainer);
                    resultItem.appendChild(buttonContainer);
                    resultsDiv.appendChild(resultItem);
                });
            }
    
            resultsContainer.classList.add("visible"); // Ergebnisbereich anzeigen
        })
        .catch(err => {
            console.error("Fehler bei der Suche:", err);
        });
    
    });
});
