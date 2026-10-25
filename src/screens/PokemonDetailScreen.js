import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getPokemonDetails } from '../services/pokemonApi';

const typeNames = {
  bug: 'Bicho',
  dark: 'Siniestro',
  dragon: 'Dragón',
  electric: 'Eléctrico',
  fairy: 'Hada',
  fighting: 'Lucha',
  fire: 'Fuego',
  flying: 'Volador',
  ghost: 'Fantasma',
  grass: 'Planta',
  ground: 'Tierra',
  ice: 'Hielo',
  normal: 'Normal',
  poison: 'Veneno',
  psychic: 'Psíquico',
  rock: 'Roca',
  steel: 'Acero',
  water: 'Agua',
};

const typeColors = {
  bug: '#8CB230',
  dark: '#5A5366',
  dragon: '#7383B9',
  electric: '#F2CB55',
  fairy: '#EBA8C3',
  fighting: '#D67873',
  fire: '#F29D52',
  flying: '#A7C3E8',
  ghost: '#8571A8',
  grass: '#78C66A',
  ground: '#C8A46B',
  ice: '#83D0D3',
  normal: '#A9A99A',
  poison: '#AB78B7',
  psychic: '#E87EA0',
  rock: '#B6A16B',
  steel: '#91A0B0',
  water: '#6CA9E8',
};

const statNames = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque especial',
  'special-defense': 'Defensa especial',
  speed: 'Velocidad',
};

export default function PokemonDetailScreen({ pokemon, onBack }) {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // useEffect, visto en clase.
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
  // Altura viene en decimetros y peso en hectogramos, ambos se dividen entre 10.
  const height = (pokemonDetails.height / 10).toFixed(1);
  const weight = (pokemonDetails.weight / 10).toFixed(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.number}>#{String(pokemonDetails.id).padStart(3, '0')}</Text>
      <Text style={styles.name}>
        {pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}
      </Text>
      <View style={styles.typeContainer}>
        {pokemonDetails.types.map((item) => (
          <View
            key={item.type.name}
            style={[styles.typeBadge, { backgroundColor: typeColors[item.type.name] || '#64748b' }]}
          >
            <Text style={styles.typeText}>{typeNames[item.type.name] || item.type.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.measurements}>
        <Text style={styles.measurement}>Altura: {height} m</Text>
        <Text style={styles.measurement}>Peso: {weight} kg</Text>
      </View>
      <Text style={styles.statsTitle}>Estadísticas base</Text>
      {pokemonDetails.stats.map((item) => {
        const percentage = Math.min((item.base_stat / 255) * 100, 100);

        return (
          <View key={item.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{statNames[item.stat.name] || item.stat.name}</Text>
            <View style={styles.statTrack}>
              <View style={[styles.statBar, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.statValue}>{item.base_stat}</Text>
          </View>
        );
      })}
      <Button title="Volver a la lista" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f6f8fc',
    padding: 24,
    paddingBottom: 40,
  },
  image: {
    width: 220,
    height: 220,
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
    marginBottom: 12,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeBadge: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  measurements: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  measurement: {
    color: '#334155',
    fontSize: 16,
  },
  statsTitle: {
    alignSelf: 'flex-start',
    color: '#20304a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    width: '100%',
  },
  statName: {
    color: '#334155',
    fontSize: 13,
    width: 105,
  },
  statTrack: {
    backgroundColor: '#dbe3ec',
    borderRadius: 6,
    flex: 1,
    height: 12,
    overflow: 'hidden',
  },
  statBar: {
    backgroundColor: '#4F8BD6',
    borderRadius: 6,
    height: '100%',
  },
  statValue: {
    color: '#20304a',
    fontSize: 14,
    textAlign: 'right',
    width: 30,
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
