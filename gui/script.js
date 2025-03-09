document.getElementById('searchBtn').addEventListener('click', () => {
    let checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
    let activeFilters = [];

    checkboxes.forEach(box => {
        if(box.checked) {
            activeFilters.push(box.value);
        }
    });

    fetch(`http://127.0.0.1:5000/search?filters=${encodeURIComponent(activeFilters.join(','))}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = "";

            if(data.results.length === 0){
                resultsDiv.innerHTML = "<p>No results found.</p>";
                return;
            }

            data.results.forEach(item => {
                let elem = document.createElement('p');
                elem.textContent = item;
                resultsDiv.appendChild(elem);
            });
        })
        .catch(err => {
            console.error('Error:', err);
        });
});
