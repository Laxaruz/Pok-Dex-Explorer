import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import { getPokemonDetails } from '../services/pokemonApi';

export default function PokemonDetailScreen({ pokemon, onBack }) {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // useEffect consulta el detalle al seleccionar un Pokemon, visto en clase.
  useEffect(() => {
    let active = true;

    async function loadPokemonDetails() {
      setLoading(true);
      setError(false);

      try {
        const data = await getPokemonDetails(pokemon.name);
        if (active) {
          setPokemonDetails(data);
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

    loadPokemonDetails();
    return () => {
      active = false;
    };
  }, [pokemon.name, retryCount]);

  if (loading) {
    return (
      <View style={styles.feedback}>
        <ActivityIndicator size="large" />
        <Text style={styles.feedbackText}>Cargando ficha...</Text>
      </View>
    );
  }

  if (error || !pokemonDetails) {
    return (
      <View style={styles.feedback}>
        <Text style={styles.feedbackText}>No se pudo cargar la ficha del Pokémon.</Text>
        <Button title="Reintentar" onPress={() => setRetryCount((count) => count + 1)} />
        <Button title="Volver a la lista" onPress={onBack} />
      </View>
    );
  }

  const imageUrl = pokemonDetails.sprites.other['official-artwork'].front_default;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.number}>#{String(pokemonDetails.id).padStart(3, '0')}</Text>
      <Text style={styles.name}>
        {pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}
      </Text>
      <Button title="Volver a la lista" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f8fc',
    padding: 24,
  },
  image: {
    width: 260,
    height: 260,
  },
  number: {
    color: '#64748b',
    fontSize: 18,
    marginTop: 12,
  },
  name: {
    color: '#20304a',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 4,
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
});
