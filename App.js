import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import { getPokemonList } from './src/services/pokemonApi';

// SafeAreaProvider permite usar los componentes de areas seguras en toda la app.
// SafeAreaView mantiene el contenido dentro del area visible del dispositivo.
export default function App() {
  // useState guarda la lista y los estados de carga y error de la pantalla.
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // useEffect consulta los primeros 20 Pokemon al abrir la app o al reintentar.
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <PokemonListScreen
          pokemon={pokemon}
          loading={loading}
          error={error}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// StyleSheet agrupa los estilos usados por la pantalla.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
  },
});
