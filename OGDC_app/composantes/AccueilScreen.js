
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import stylesCommuns from '../styles';
import { nbItemPanier, obtenirPanier} from '../panier';
import Tuilerie from './Tuilerie';
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
  order_success: "Merci d’avoir commandé Chez Homer"
  };
  const tabTraduction = {
  "en-US": en,
  "en-CA": en,
  "fr-CA": fr_ca,
  };
  const i18n = new I18n(tabTraduction);
  i18n.locale = langue_région;

export default function AccueilScreen({ navigation, route }) {
  const { nom } = route.params;
  const [nbItemsPanier, setNbItemsPanier] = useState(nbItemPanier());
  useEffect(() => {//jai du chercher un peu pour trouver cela... je ne sais pas si il sagit de la bonne facon mais je ne trouvais pas comment rafraichire
    return navigation.addListener('focus', () => {
      setNbItemsPanier(nbItemPanier());
    });
    ;
  }, [navigation]);
   
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AntDesign name="logout" size={25}
          color="blue"
          onPress={() => {
            navigation.replace("Authen");
          }}
        />
      ),
    });
  }, [navigation]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => nbItemsPanier > 0 && (
          <AntDesign name="shoppingcart" size={25}
            color="blue"
            onPress={() => {
              navigation.navigate("Panier");
            }}
          />
      ),
    });
  }, [nbItemsPanier, navigation]);  

  return (
    <View style={stylesCommuns.app}>
      <View style={styles.section_haut}>
      <Text style={styles.bienvenue}>{i18n.t("welcome")} {nom}</Text>
      </View>
      <View >
      <Tuilerie style={styles.section_bas}>
        <Tuile texte={i18n.t("menu")} iconNom="book" onPress_cb={() => navigation.navigate('Ardoise')} />
        <Tuile texte={i18n.t("orders")} iconNom="inbox" onPress_cb={() => navigation.navigate('Commandes')} />
        <Tuile texte={i18n.t("contact")} iconNom="team" onPress_cb={() => navigation.navigate('RestoInfo')} />
      </Tuilerie>
      </View>
      </View>
  );
}

export function Tuile({ texte, onPress_cb, iconNom }) {
  return (
    <Pressable style={styles.tuile} onPress={onPress_cb}>
      <View style={styles.tuile_icon}>
        <AntDesign name={iconNom} size={50} color="black" />
      </View>
      <View style={styles.tuile_texte_box}>
        <Text style={styles.tuile_texte}>{texte}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section_haut: {
    flex: 1/3,
    justifyContent: "center"
},
section_bas: {
    flex: 2/3,
    alignItems: "center",
    justifyContent: "center"
},
  bienvenue: {
    fontSize: 22,
    textAlign: 'center',
  },
  tuile: {
    flex: 0,
    height: 150,
    width: 150,
    margin: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  tuile_icon: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  tuile_texte_box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tuile_texte: {
    fontSize: 22,
  },
});