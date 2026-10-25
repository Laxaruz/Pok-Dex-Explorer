const API_URL = 'https://pokeapi.co/api/v2/pokemon';

// Se usa fetch con async/await y se valida response.ok antes de leer JSON. visto en clase
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de Pokémon.');
  }

  const data = await response.json();
  return data;
}

export async function getPokemonDetails(identifier) {
  const pokemonIdentifier = String(identifier).trim().toLowerCase();
  const response = await fetch(`${API_URL}/${pokemonIdentifier}`);

  if (!response.ok) {
    throw new Error('No se pudo encontrar ese Pokémon.');
  }

  const data = await response.json();
  return data;
}
