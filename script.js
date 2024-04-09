document.addEventListener("DOMContentLoaded", () => {
  const pokemonList = document.getElementById("pokemon-list");
  const caughtPokemonList = document.getElementById("caught-pokemon");
  const detailsSection = document.getElementById("pokemon-details");

  async function fetchPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    displayPokemon(data.results);
  }

  function displayPokemon(pokemon) {
    pokemon.forEach((p) => {
      const pokemonItem = document.createElement("div");
      pokemonItem.classList.add("pokemon-item");
      const pokemonImage = document.createElement("img");
      const pokemonId = p.url.split("/").filter(Boolean).pop(); // Extracts ID from URL
      pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      const pokemonName = document.createElement("span");
      pokemonName.textContent = p.name;
      pokemonItem.appendChild(pokemonImage);
      pokemonItem.appendChild(pokemonName);
      pokemonItem.addEventListener("click", () => {
        fetchPokemonDetails(p.url);
      });
      pokemonList.appendChild(pokemonItem);
    });
  }

  async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    const data = await response.json();
    displayPokemonDetails(data);
  }

  function displayPokemonDetails(pokemon) {
    detailsSection.innerHTML = `<h2>Pokémon Details</h2>
            <div>Name: ${pokemon.name}</div>
            <div>Height: ${pokemon.height}</div>
            <div>Weight: ${pokemon.weight}</div>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;

    if (!document.getElementById(`caught-${pokemon.id}`)) {
      const catchButton = document.createElement("button");
      catchButton.textContent = "Catch";
      catchButton.addEventListener("click", () => {
        catchPokemon(pokemon);
      });
      detailsSection.appendChild(catchButton);
    }
  }

  function catchPokemon(pokemon) {
    const caughtPokemonItem = document.createElement("div");
    caughtPokemonItem.id = `caught-${pokemon.id}`;
    caughtPokemonItem.classList.add("pokemon-item");
    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemon.sprites.front_default;
    const pokemonName = document.createElement("span");
    pokemonName.textContent = pokemon.name;
    caughtPokemonItem.appendChild(pokemonImage);
    caughtPokemonItem.appendChild(pokemonName);
    caughtPokemonList.appendChild(caughtPokemonItem);

    // Remove the 'Catch' button since the Pokémon is caught
    const catchButton = detailsSection.querySelector("button");
    if (catchButton) {
      catchButton.remove();
    }
  }

  fetchPokemon();
});
