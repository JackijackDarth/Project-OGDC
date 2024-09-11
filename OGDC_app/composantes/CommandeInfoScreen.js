import { View, Pressable, Text } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import ItemMenu from './ItemMenu';
import Tuilerie from './Tuilerie';

import { obtenirUneCommandeJSON } from '../utils';
import stylesCommuns from '../styles';

export default function CommandeInfoScreen({ route }) {
    const { idCommande } = route.params;
    const [commande, setCommande] = useState(null);

    useEffect(() => {
        async function recuperercommande() {
            try {
                const data = await obtenirUneCommandeJSON(idCommande);
                setCommande(data);
            } catch (error) {
                console.error("la commande na pas pu etre recup", error);
            }
        }

        recuperercommande();
    }, [idCommande]);

    if (!commande) {
        return (
            <View style={stylesCommuns.app}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={stylesCommuns.app}>
            <Tuilerie>
                {commande.items.map(item => (
                    <ItemMenu
                        key={item.idItem}
                        titre={item.nomItem}
                        prix={item.prix}
                        image={item.image}
                    />
                ))}
            </Tuilerie>
        </View>
    );
}