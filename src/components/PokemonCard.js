import { Image, Pressable, StyleSheet, Text } from 'react-native';

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function PokemonCard({ pokemon, onPress, fillRow = false }) {
  // La lista no trae un id separado; se obtiene del ultimo segmento de la URL.
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  // Pressable abre la ficha; Image y Text muestran la tarjeta.
  return (
    <Pressable style={[styles.card, fillRow && styles.fillRow]} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.number}>#{String(id).padStart(3, '0')}</Text>
      <Text style={styles.name}>{formatName(pokemon.name)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
  },
  fillRow: {
    flex: 1,
  },
  image: {
    width: 110,
    height: 110,
  },
  number: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  name: {
    color: '#20304a',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
  },
});
