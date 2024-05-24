let pokemons = [];
const poke_container = document.getElementById("poke_container");
const baseUrl = "https://pokeapi.co/api/v2/pokemon";
const pokemons_number = 151; // จำนวนโปเกมอนที่ต้องการแสดงผล
const search = document.getElementById("search");
const form = document.getElementById("form");

// ฟังก์ชั่นเพื่อดึงข้อมูลโปเกมอน
const fetchPokemons = async () => {
    for (let i = 1; i <= pokemons_number; i++) {
        await getPokemon(i);
    }
    displayPokemons(pokemons);
};

// ลบการ์ดโปเกมอนทั้งหมดออกจาก DOM
const removePokemon = () => {
    const pokemonEls = document.getElementsByClassName("pokemon");
    while (pokemonEls.length > 0) {
        pokemonEls[0].remove();
    }
};

// ดึงข้อมูลโปเกมอนด้วย id
const getPokemon = async (id) => {
    const res = await fetch(`${baseUrl}/${id}`);
    const pokemon = await res.json();
    pokemons.push(pokemon);
};

// แสดงการ์ดโปเกมอน
const displayPokemons = (pokemonList) => {
    removePokemon();
    pokemonList.forEach((pokemon) => createPokemonCard(pokemon));
};

// ฟิลเตอร์และแสดงโปเกมอนตามการค้นหา
const getPokemonByName = (name) => {
    const searchPokemons = pokemons.filter((poke) => poke.name.toLowerCase().includes(name.toLowerCase()));
    displayPokemons(searchPokemons);
};

// สร้างการ์ดโปเกมอน
function createPokemonCard(pokemon) {
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");
    const poke_types = pokemon.types.map((el) => el.type.name).join(", ");
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const poke_stat = pokemon.stats.map((el) => el.stat.name);
    const stats = poke_stat.slice(0, 3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);
    const stat = stats.map((stat) => {
        return `<li class="names">${stat}</li>`;
    }).join("");
    const base = base_stat.map((base) => {
        return `<li class="base">${base}</li>`;
    }).join("");
    const pokeInnerHTML = `
        <div class="img-container">
            <img src="${pokemon.sprites.front_default}" alt="${name}"/>
        </div>
        <div class="info">
            <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: ${poke_types}</small>
        </div>
        <div class="stats">
            <h2>Stats</h2>
            <div class="flex">
                <ul>${stat}</ul>
                <ul>${base}</ul>
            </div>
        </div>`;
    pokemonEl.innerHTML = pokeInnerHTML;
    poke_container.appendChild(pokemonEl);
}

// เริ่มการดึงข้อมูลโปเกมอน
fetchPokemons();

// จัดการการส่งฟอร์มเพื่อค้นหาโปเกมอน
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        getPokemonByName(searchTerm);
    } else {
        displayPokemons(pokemons);
    }
    search.value = "";
});
