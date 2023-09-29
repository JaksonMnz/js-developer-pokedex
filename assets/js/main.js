const pokemonList = document.getElementById('pokemonList')

const loadMoreButton = document.getElementById('loadMoreButton')
const maxRecords = 151
const limit = 1
let offset = 0;

function calculateTotalStats(pokemon) {
    const total = pokemon.statValues.reduce((acc, value) => acc + value, 0);
    return total;
}

function convertPokemonToLi(pokemon) {
    const totalStats = calculateTotalStats(pokemon);

    return `
        <li class="pokemon ">
            <div class="top ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <h1 class="name ${pokemon.name === 'Total' ? 'black' : ''}">${pokemon.name}</h1>
                <!-- Tipos -->
                <ul class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ul>

                <!-- Imagem -->
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            <div class="bottom">
                <!-- Habilidades -->
               
                <ul class="abilities">  <h3>Abilities</h3>
                    ${pokemon.abilities.map((ability) => `<li class="ability">${ability}</li>`).join('')}
                </ul>
                <!-- Status -->
                <div class="stats">
                    <h4>Base Stats</h4>
                    <ul class="stat-list">
                        ${pokemon.stats.map((stat, index) => `
                            <li class="stat ${pokemon.statValues[index] > 50 ? 'stat-high' : 'stat-low'}">
                                <span class="stat-name">${stat}:</span>
                                <span class="stat-value ${pokemon.statValues[index] > 50 ? 'green' : 'red'}">${pokemon.statValues[index]}</span>
                                <div class="chart-container max-chart-height">
                                    <canvas class="chart ${pokemon.statValues[index] > 50 ? 'green-chart' : 'red-chart'}"></canvas>
                                </div>
                            </li>
                        `).join('')}
                        <!-- Total dos Status -->
                        ${pokemon.name === 'Total' ? '' : `
                            <li class="stat ${totalStats > 50 ? 'stat-high' : 'stat-low'}">
                                <span class="stat-name">Total:</span>
                                <span class="stat-value ${totalStats > 50 ? 'green' : 'red'}">${totalStats}</span>
                                <div class="chart-container max-chart-height">
                                    <canvas class="chart ${totalStats > 50 ? 'green-chart' : 'red-chart'}"></canvas>
                                </div>
                            </li>
                        `}
                    </ul>
                </div>
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
