import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';

export default function PokemonListScreen({ pokemon, loading, error, onRetry, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéDex Explorer</Text>

      {loading ? (
        <View style={styles.feedback}>
          <ActivityIndicator size="large" />
          <Text style={styles.feedbackText}>Cargando Pokémon...</Text>
        </View>
      ) : error ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>No se pudieron cargar los Pokémon.</Text>
          <Button title="Reintentar" onPress={onRetry} />
        </View>
      ) : pokemon.length === 0 ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>No hay Pokémon para mostrar.</Text>
        </View>
      ) : (
        // FlatList muestra solo las tarjetas necesarias en pantalla.
        <FlatList
          data={pokemon}
          keyExtractor={(item) => item.url}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} onPress={() => onSelect(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
  },
  title: {
    color: '#20304a',
    fontSize: 26,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  feedback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  feedbackText: {
    color: '#334155',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
  },
});
