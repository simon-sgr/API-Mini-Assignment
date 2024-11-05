async function loadJokeTypes() {
  const select = document.getElementById("type");

  fetch("http://localhost:3000/api/jokes/types")
    .then((response) => response.json())
    .then((types) => {
      types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type.charAt(0).toUpperCase() + type.slice(1);
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getJokes() {
  const jokesDiv = document.getElementById("jokes");
  const jokesInfo = document.getElementById("info");
  const type = document.getElementById("type").value;
  const count = document.getElementById("count").value;

  await fetch(`http://localhost:3000/api/jokes/${type}?count=${count}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((jokes) => {
      if (jokes.length != count) {
        jokesInfo.innerHTML = `<p>Only ${jokes.length} jokes available for type ${type}</p>`;
        jokesInfo.style.display = "block";
      } else {
        jokesInfo.innerHTML = "";
        jokesInfo.style.display = "none";
      }

      if (jokes.length === 1) {
        // As the requiments say; wait 3 seconds for punch line if a single joke is requested
        jokesDiv.innerHTML = `<p><b>Setup:</b> ${jokes[0].setup}</p>`;
        setTimeout(() => {
          jokesDiv.innerHTML += `<p><b>Punchline:</b> ${jokes[0].punchline}</p>`;
        }, 3000);
      } else {
        let table =
          "<table><tr><th>ID</th><th>Type</th><th>Setup</th><th>Punchline</th></tr>";
        jokes.forEach((joke) => {
          table += `<tr><td>${joke.id}</td><td>${joke.type}</td><td>${joke.setup}</td><td>${joke.punchline}</td></tr>`;
        });
        table += "</table>";
        jokesDiv.innerHTML = table;
      }
    })
    .catch((error) => {
      jokesDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
