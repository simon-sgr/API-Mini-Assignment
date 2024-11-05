const express = require("express");
const app = express();
const cors = require("cors");
const jokes = require("./jokes.json");
const path = require("path");
const PORT = 3000;
const ANY_TYPE = "any";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

const validJokeTypes = Array.from(new Set(jokes.map((joke) => joke.type)))
  .concat(ANY_TYPE)
  .sort();

const getRandomJokes = (jokesArray, count) => {
  const randomJokes = [];
  while (randomJokes.length < count && jokesArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * jokesArray.length);
    randomJokes.push(jokesArray[randomIndex]);
    jokesArray.splice(randomIndex, 1);
  }
  return randomJokes;
};

app.get("/api/jokes/types", (req, res) => {
  res.json(validJokeTypes);
});

app.get("/api/jokes/:type", (req, res) => {
  const { type } = req.params;
  // As the requirement is to return one joke if no count is provided
  let count = parseInt(req.query.count) || 1;

  if (!validJokeTypes.includes(type)) {
    return res.status(404).json({ error: "Not found" });
  }

  let selectedJokes = jokes;
  if (type !== ANY_TYPE) {
    selectedJokes = jokes.filter((joke) => joke.type === type);
  }

  // As the requirement is to return all jokes if count is greater than the number of jokes available
  count = Math.min(count, selectedJokes.length);

  const randomJokes = getRandomJokes([...selectedJokes], count);

  res.json(randomJokes);
});

app.use((req, res) => {
  res.status(400).json({ error: "Bad Request" });
});
