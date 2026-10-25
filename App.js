import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import { getPokemonDetails, getPokemonList } from './src/services/pokemonApi';
import { appendUniquePokemon } from './src/utils/pagination';

const PAGE_SIZE = 20;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  // useRef conserva el siguiente offset y evita solicitudes simultaneas de paginas.
  const nextOffsetRef = useRef(null);
  const initialLoadingRef = useRef(true);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let active = true;
    initialLoadingRef.current = true;
    nextOffsetRef.current = null;
    setLoadMoreError(false);

    async function loadPokemon() {
      setLoading(true);
      setError(false);

      try {
        const data = await getPokemonList(PAGE_SIZE, 0);
        if (active) {
          const firstPage = Array.isArray(data.results) ? data.results : [];
          setPokemon(firstPage);
          nextOffsetRef.current = data.next && firstPage.length > 0 ? PAGE_SIZE : null;
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          initialLoadingRef.current = false;
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

  async function handleLoadMore() {
    const offset = nextOffsetRef.current;
    if (isSearching || error || initialLoadingRef.current || loadingMoreRef.current || offset === null) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError(false);

    try {
      // El offset avanza de 20 en 20 solo despues de recibir una pagina valida.
      const data = await getPokemonList(PAGE_SIZE, offset);
      const nextPage = Array.isArray(data.results) ? data.results : [];
      nextOffsetRef.current = data.next && nextPage.length > 0 ? offset + PAGE_SIZE : null;
      setPokemon((current) => appendUniquePokemon(current, nextPage));
    } catch {
      // Si falla la peticion, se conserva el offset para reintentar la misma pagina.
      setLoadMoreError(true);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }

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
            loadingMore={loadingMore}
            loadMoreError={loadMoreError}
            onLoadMore={handleLoadMore}
            onRetryLoadMore={handleLoadMore}
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
