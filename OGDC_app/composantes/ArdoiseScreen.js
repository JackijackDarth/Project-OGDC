import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';

import { BarreOutils, Bouton } from './BarreOutils';
import ItemMenu from './ItemMenu';

import { obtenirMenuJSON } from '../utils';
import { nbItemPanier, ajouterItemPanier } from '../panier';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const paramètresLocaux = Localization.getLocales();
const paramêtresCalendrier = Localization.getCalendars();
const langue_région = paramètresLocaux[0].languageTag;

const en = {
  welcome: "Hello",
  menu: "Menu",
  orders: "Orders",
  contact: "Contact Us",
  shopping_cart: "Shopping Cart",
  total_price: "Total Price",
  tax_gst: "GST",
  tax_qst: "QST",
  delete: "Delete",
  order: "Order",
  chose: "Chose",
  order_success: "Thank you for ordering at Chez Homer"
  };
  const fr_ca = {
  welcome: "Bonjour",
  menu: "Menu",
  orders: "Commandes",
  contact: "Nous joindre",
  shopping_cart: "Panier",
  total_price: "Prix total",
  tax_gst: "TPS",
  tax_qst: "TVQ",
  delete: "Supprimer",
  order: "Commander",
  chose:"Choisir",
  order_success: "Merci d’avoir commandé Chez Homer"
  };
  const tabTraduction = {
  "en-US": en,
  "en-CA": en,
  "fr-CA": fr_ca,
  };
  const i18n = new I18n(tabTraduction);
  i18n.locale = langue_région;
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
    obtenirMenuJSON().then(menu => setMenu(menu));
  }, []);

  function choisirItem(item) {
    ajouterItemPanier(item);
    setSelectedItem(null);
    setNbItemsPanier(nbItemPanier())
  }

  return (
    <View style={stylesCommuns.app}>
      <ScrollView>
        {menuJSON.map((categorie, index) => (
          <Catégorie key={index} titre={categorie.titre} couleur={mapcouleur[categorie.titre]}>
            {categorie.items.map(item => (
              <ItemMenu
                key={item.idItem}
                sélectionné={item === selectedItem}
                titre={item.nomItem}
                prix={item.prix}
                onPress_cb={() => setSelectedItem(item)}
                image={item.image}
              />
            ))}
          </Catégorie>
        ))}
      </ScrollView>
      <Bouton texte={i18n.t("chose")} onPress_cb={() => selectedItem != null &&(choisirItem(selectedItem))} style={styles.boutton}/>
    </View>
  );
}

function Catégorie({ titre, couleur, children }) {
  
  return (
    <View style={[styles.section,{ backgroundColor: couleur }]}>
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