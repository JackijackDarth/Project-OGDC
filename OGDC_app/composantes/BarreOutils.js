import { StyleSheet, Text, View, Pressable } from 'react-native';

export function BarreOutils({ children }) {
  return (
    <View style={styles.barre_outils}>
      {children}
    </View>
  );
}

export function Bouton({ texte, onPress_cb, style }) {

  return (
    <Pressable style={[styles.bouton, style]} onPress={onPress_cb}>
      <Text style={styles.étiquetteBouton}>{texte}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  barre_outils: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bouton: {
    margin: 5,
    borderRadius: 5
  },
  étiquetteBouton: {
    fontSize: 22,
  },
});
