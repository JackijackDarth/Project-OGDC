import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { Image } from 'react-native';

export default function ItemMenu({ sélectionné = false, username, onPress_cb }) {
  // const uri = `data:image/jpg;base64,${image}`;

  return (
    <Pressable onPress={onPress_cb} style={[styles.item,sélectionné ? styles.itemSélectionné : styles.item]}>

      {/* <Image source={{ uri }} style={styles.image} /> */}
      <View style={styles.itemDesc}>
        <Text>{username}</Text>
         
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  item: {
    flex: 0,
    height: 170,
    width: 170,
    margin: 10,
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "thistle",
  },
  itemSélectionné: {
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "red",
  },
  itemDesc: {
    fontSize: 18,
    color: "palevioletred",
    alignItems:"center",
    flex: 0
  },
  image: {
    width: 110,
    height: 110,
  },
});