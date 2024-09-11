import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';

import { BarreOutils, Bouton } from './BarreOutils';
import ItemMenu from './ItemMenu';
import Tuilerie from './Tuilerie';
import { placerCommandeJSON } from '../utils';
import { supprimerItemPanier, initPanier, obtenirPanier, nbItemPanier } from '../panier';
import stylesCommuns from '../styles';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const paramètresLocaux = Localization.getLocales();
const paramêtresCalendrier = Localization.getCalendars();
const langue_région = paramètresLocaux[1].languageTag;
const deviseFormateur = new Intl.NumberFormat(langue_région,
    { style: 'currency', currency: 'CAD' });
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
export default function PanierScreen({ navigation }) {
    const [panier, setPanier] = useState(obtenirPanier());
    const [statutCommande, setStatutCommande] = useState(null);
    const [itemSélectionné, setItemSélectionné] = useState(null);
    const [nbItems, setndItems ] = useState(nbItemPanier)

    useEffect(() => {
        setPanier(obtenirPanier());
    }, [statutCommande]);

    const total = panier.reduce((acc, item) => acc + item.prix, 0);
    const tps = total * 0.05;
    const tvq = total * 0.09975;
    const totalFinal = total + tps + tvq;

    function supprimerItem() {
        if (itemSélectionné) {
            supprimerItemPanier(itemSélectionné);
            setPanier(obtenirPanier());
            setItemSélectionné(null);
            setndItems(nbItemPanier())
        }
    }

    async function commanderItems() {
        try {
            if (nbItemPanier() < 1){
                setStatutCommande("Vous n'avez pas d'items dans votre panier!");
            }
            else{
                await placerCommandeJSON(panier);
                initPanier();
                setPanier(obtenirPanier());
                setStatutCommande(i18n.t('order_success'));
            }
        } catch (error) {
            setStatutCommande("pas marcher");
        }
    }

    return (
        <View style={stylesCommuns.app}>
            <ScrollView contentContainerStyle={styles.sectionHaut}>
                <Tuilerie>
                    {panier.map(item => (
                        <ItemMenu
                            key={item.idItem}
                            titre={item.nomItem}
                            prix={item.prix}
                            onPress_cb={() => setItemSélectionné(item)}
                            image={item.image}
                            sélectionné={itemSélectionné && itemSélectionné.idItem === item.idItem}
                        />
                    ))}
                </Tuilerie>
            </ScrollView>
            <View style={styles.sectionBas}>
                <View style={styles.prixSection}>
                <Text>{i18n.t('total_price')}: {deviseFormateur.format(total)}</Text>
        <Text>{i18n.t('tax_gst')}: {deviseFormateur.format(tps)}CAD</Text>
        <Text>{i18n.t('tax_qst')}: {deviseFormateur.format(tvq)}CAD</Text>
        <Text>Total: {deviseFormateur.format(totalFinal)} CAD</Text>
                    </View>
                </View>
                {statutCommande && (
                    <View style={styles.messageCommande}>
                        <Text>{statutCommande}</Text>
                    </View>
                )}
                <BarreOutils>
                    <Pressable style={styles.bouton} onPress={supprimerItem}>
                        <Text style={styles.boutonTexte}>Supprimer</Text>
                    </Pressable>
                    <Pressable style={styles.bouton} onPress={commanderItems}>
                        <Text style={styles.boutonTexte}>Commander</Text>
                    </Pressable>
                </BarreOutils>
            
            </View>
    );
}

const styles = StyleSheet.create({
    sectionHaut: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
         
    },
    sectionBas: {
        flex: 1/3,
        justifyContent:"flex-end",
        alignItems: "center",
   
    },
    bouton: {
        backgroundColor: '#6200ee',
        padding: 10,
        borderRadius: 5,
    },
    boutonTexte: {
        color: 'white',
        fontSize: 18,
    },
    prixSection: {
        alignItems: "flex-end",
        marginBottom: 35,
    },
    messageCommande: {
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        borderRadius: 10,
        elevation: 5,
    },
});
