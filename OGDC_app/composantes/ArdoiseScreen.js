import { ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { Text, View, FlatList } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';

import { BarreOutils, Bouton } from './BarreOutils';
import ItemMenu from './ItemMenu';

import { obtenirRobotsJSON } from '../utils';
import { nbItemPanier, ajouterItemPanier } from '../panier';

import stylesCommuns from '../styles';

const mapcouleur = {
  "Déjeuner": "#98de9c",
  "Sandwichs": "#98b7de",
  "Salades": "#de98da",
  "Smoothies": "#debf98",
  "Breuvages": "#de9c98",
};


export default function ArdoiseScreen({ navigation }) {
  const [menuJSON, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nbItemsPanier, setNbItemsPanier] = useState(nbItemPanier());
  console.log(menuJSON)
  useEffect(() => {//jai du chercher un peu pour trouver cela... je ne sais pas si il sagit de la bonne facon mais je ne trouvais pas comment rafraichire
    return navigation.addListener('focus', () => {
      setNbItemsPanier(nbItemPanier());
    });
    ;
  }, [navigation]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <><AntDesign name="shoppingcart" size={25}
          color="blue"
          onPress={() => {
            navigation.navigate("Panier");
          } } /><Text>{nbItemsPanier}</Text></>
      ),
    });
  }, [nbItemsPanier,navigation]); 
  useEffect(() => {
    obtenirRobotsJSON().then(menu => setMenu(menu));
  }, []);

  function choisirItem(item) {
    ajouterItemPanier(item);
    setSelectedItem(null);
    setNbItemsPanier(nbItemPanier())
  }

  return (
    <View style={stylesCommuns.app}>
      {/* <ScrollView>
        {menuJSON.map((categorie, index) => (
          <Catégorie key={index} titre={categorie.username} >
            {categorie.items.map(item => (
              <ItemMenu
                key={item.id}
                sélectionné={item === selectedItem}
                titre={item.username}
                // onPress_cb={() => setSelectedItem(item)}
                // image={item.image}
              />
            ))}
          </Catégorie>
        ))}
      </ScrollView> */}
      <FlatList style={styles.liste}
           
           //numColumns={1}
           data={menuJSON}
           renderItem={({ item, index }) => {
             console.log(item.username);
             return <Thumbnail Nom={`${item.username}`} thumb_cb={() => setCurrentImage(item)} />
           }}
         />
      <Bouton texte={"chose"} onPress_cb={() => selectedItem != null &&(choisirItem(selectedItem))} style={styles.boutton}/>
    </View>
  );
}





export function Thumbnail({ Nom, thumb_cb }) {
  function onClick_cb(e) {
    if (thumb_cb !== null && thumb_cb !== undefined)
      thumb_cb();
  }
  return (
    <Pressable style={styles.thumbnail} onPress={onClick_cb}>
      <Text>{}</Text>
    </Pressable>
  )
}
function Catégorie({ titre, children }) {
  
  return (
    <View style={[styles.section,{ backgroundColor: "#98de9c" }]}>
      <Text>{titre}</Text>
      <ScrollView horizontal>
        {children}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  sectionDesc: {
    textAlign: 'left',
    fontSize: 22,
  },
  section: {
    margin: 5,
  },
  boutton:{
    alignItems:"center"
  }
});