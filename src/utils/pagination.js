// Set evita repetir Pokemon al unir los resultados de distintas paginas.
export function appendUniquePokemon(currentPokemon, nextPokemon) {
  const knownUrls = new Set(currentPokemon.map((pokemon) => pokemon.url));
  const uniquePokemon = nextPokemon.filter((pokemon) => {
    if (knownUrls.has(pokemon.url)) return false;
    knownUrls.add(pokemon.url);
    return true;
  });

  return [...currentPokemon, ...uniquePokemon];
}
