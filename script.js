function parseUrl(url) {
    return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

function isCaught(pokemonId) {
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon') || '[]');
    return caughtPokemon.includes(pokemonId);
}

function toggleCaught(pokemonId) {
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon') || '[]');
    if (caughtPokemon.includes(pokemonId)) {
        const index = caughtPokemon.indexOf(pokemonId);
        caughtPokemon.splice(index, 1);
    } else {
        caughtPokemon.push(pokemonId);
    }
    localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
    updatePokemonList();
}

async function fetchPokemon(offset = 0, limit = 20) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    displayPokemon(data.results);
}

function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = ''; 
    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        const pokemonId = parseUrl(pokemon.url);
        pokemonElement.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
            <button class="catch-btn" data-pokemon-id="${pokemonId}">${isCaught(pokemonId) ? 'Release' : 'Catch'}</button>
        `;
        pokemonElement.addEventListener('click', () => showPokemonDetail(pokemonId));
        pokemonContainer.appendChild(pokemonElement);
    });

    document.querySelectorAll('.catch-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const pokemonId = button.getAttribute('data-pokemon-id');
            toggleCaught(pokemonId);
        });
    });
}

async function showPokemonDetail(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const pokemon = await response.json();
    const detailContainer = document.getElementById('pokemon-detail');
    detailContainer.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <ul>
            ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
    `;
    detailContainer.style.display = 'block';
}

function updatePokemonList() {
    const pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach(pokemonElement => {
        const button = pokemonElement.querySelector('.catch-btn');
        const pokemonId = button.getAttribute('data-pokemon-id');
        button.textContent = isCaught(pokemonId) ? 'Release' : 'Catch';
    });
}

let offset = 0;
const limit = 20;
document.getElementById('load-more').addEventListener('click', () => {
    offset += limit;
    fetchPokemon(offset, limit);
});

fetchPokemon();

