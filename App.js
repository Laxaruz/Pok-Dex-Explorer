import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import { getPokemonDetails, getPokemonList } from './src/services/pokemonApi';

// SafeAreaView, useState y useEffect, vistos en clase.
export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchStatus, setSearchStatus] = useState('idle');
  const [searchRetryCount, setSearchRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPokemon() {
      setLoading(true);
      setError(false);

      try {
        const data = await getPokemonList();
        if (active) {
          setPokemon(Array.isArray(data.results) ? data.results : []);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPokemon();
    return () => {
      active = false;
    };
  }, [retryCount]);

  useEffect(() => {
    if (!searchQuery) return;

    let active = true;

    async function loadSearchResult() {
      setSearchStatus('loading');
      setSearchResult(null);

      try {
        const data = await getPokemonDetails(searchQuery);
        if (active) {
          // El id de la ficha permite crear la URL que espera PokemonCard.
          setSearchResult({
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
          });
          setSearchStatus('success');
        }
      } catch (requestError) {
        if (active) {
          // Un 404 significa que no hubo coincidencias; otros fallos permiten reintentar.
          setSearchStatus(requestError.status === 404 ? 'not-found' : 'error');
        }
      }
    }

    loadSearchResult();
    return () => {
      active = false;
    };
  }, [searchQuery, searchRetryCount]);

  function handleSearch() {
    const normalizedQuery = searchInput.trim().toLowerCase();

    setSearchQuery(normalizedQuery);
    setSearchResult(null);
    setSearchStatus(normalizedQuery ? 'loading' : 'idle');
    if (normalizedQuery) {
      setSearchRetryCount((count) => count + 1);
    }
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearchQuery('');
    setSearchResult(null);
    setSearchStatus('idle');
  }

  function handleRetry() {
    if (searchQuery) {
      setSearchStatus('loading');
      setSearchRetryCount((count) => count + 1);
    } else {
      setRetryCount((count) => count + 1);
    }
  }

  const isSearching = searchQuery !== '';
  const visiblePokemon = isSearching ? (searchResult ? [searchResult] : []) : pokemon;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {selectedPokemon ? (
          <PokemonDetailScreen
            pokemon={selectedPokemon}
            onBack={() => setSelectedPokemon(null)}
          />
        ) : (
          <PokemonListScreen
            pokemon={visiblePokemon}
            loading={isSearching ? searchStatus === 'loading' : loading}
            error={isSearching ? searchStatus === 'error' : error}
            notFound={isSearching && searchStatus === 'not-found'}
            isSearching={isSearching}
            searchInput={searchInput}
            onChangeSearchInput={setSearchInput}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            onRetry={handleRetry}
            onSelect={setSelectedPokemon}
          />
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
  },
});
