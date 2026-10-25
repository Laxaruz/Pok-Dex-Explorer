import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';

export default function PokemonListScreen({
  pokemon,
  loading,
  error,
  notFound,
  isSearching,
  searchInput,
  onChangeSearchInput,
  onSearch,
  onClearSearch,
  onRetry,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéDex Explorer</Text>

      <View style={styles.searchRow}>
        {/* TextInput y Button, vistos en clase. */}
        <TextInput
          style={styles.searchInput}
          placeholder="Busca por nombre o número..."
          value={searchInput}
          onChangeText={onChangeSearchInput}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Buscar" onPress={onSearch} />
      </View>
      {isSearching && <Button title="Limpiar búsqueda" onPress={onClearSearch} />}

      {loading ? (
        <View style={styles.feedback}>
          <ActivityIndicator size="large" />
          <Text style={styles.feedbackText}>
            {isSearching ? 'Buscando Pokémon...' : 'Cargando Pokémon...'}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>
            {isSearching
              ? 'No se pudo completar la búsqueda de Pokémon.'
              : 'No se pudieron cargar los Pokémon.'}
          </Text>
          <Button title="Reintentar" onPress={onRetry} />
        </View>
      ) : notFound ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>No se encontró ningún Pokémon con ese nombre o número.</Text>
        </View>
      ) : pokemon.length === 0 ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>No hay Pokémon para mostrar.</Text>
        </View>
      ) : isSearching ? (
        <View style={styles.searchResult}>
          <PokemonCard pokemon={pokemon[0]} onPress={() => onSelect(pokemon[0])} />
        </View>
      ) : (
        // FlatList, visto en clase.
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchResult: {
    width: '55%',
    paddingHorizontal: 16,
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
