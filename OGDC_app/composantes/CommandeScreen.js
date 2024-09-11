import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { obtenirCommandesJSON } from '../utils';

import stylesCommuns from '../styles';

export default function CommandeScreen({ navigation }) {
    const [commandesJSON, setCommandesJSON] = useState([]);
    useEffect(() => {
        async function recuperercommande() {
            try {
                const data = await obtenirCommandesJSON();
                setCommandesJSON(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes:", error);
            }
        }

        recuperercommande();
    }, []);

    return (
        <View style={stylesCommuns.app}>
            <FlatList
                data={commandesJSON}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable 
                        style={styles.item}
                        onPress={() => navigation.navigate("CommandeInfo", { idCommande: item.id })}>
                        <Text>{`${item.id} = ${item.prénom}, ${item.nom}-> ${item.statut}`}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: 'center',
        borderBottomColor: 'rebeccapurple',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 60
    },
    itemDesc: {
        fontSize: 16,
        flex: 0
    },
});