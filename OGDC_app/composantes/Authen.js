import { StyleSheet } from 'react-native';
import { Text, View, Pressable, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { BarreOutils, Bouton } from './BarreOutils';
import {KeyboardAvoidingView} from 'react-native';

import { obtenirAuthenJSON } from '../utils';

import stylesCommuns from '../styles';

export function AuthenScreen({ navigation }) {

    function créerCompte() {
        console.log("TBD");
    }
    function seConnecter() {
        navigation.navigate("SeConnecter");
    }

    return (
        <View style={stylesCommuns.app}>
            <View style={styles.section_haut}>
                <Text style={styles.titre}>OGDC</Text>
            </View>
            <View style={styles.section_bas}>
                <Pressable onPress={créerCompte}>
                    <Text style={styles.créer_compte}>Créer un compte</Text>
                </Pressable>
                <Pressable onPress={seConnecter}>
                    <Text style={styles.se_connecter}>Se connecter</Text>
                </Pressable>
            </View>
        </View>
    );
}

export function SeConnecterScreen({ navigation }) {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("password");
    // const [username, setUsername] = useState(null);
    // const [password, setPassword] = useState(null);

    function seConnecter() {
        obtenirAuthenJSON(username, password).then((res) => {
            console.log("login succès: %s", res);
            navigation.popToTop();
            navigation.replace("Accueil", { nom: res.nom });
        })
            .catch(err => {
                console.log("login échec: %s", err);
            });
    }

    useEffect(() => {
        console.log("UseEffect SeConnecter")
        navigation.setOptions({
            headerRight: () => {
                return (
                    <Pressable onPress={() => navigation.navigate("Aide")}>
                        <Text >Aide</Text>
                    </Pressable>
                );
            }
        });

        return () => console.log("Ramassage SeConnecter")

    }, [navigation]);

    console.log("Refress SeConnecter %s / %s", username, password)

    return (
        <View style={stylesCommuns.app}>
            <View style={styles.section_haut}>
                <Text style={styles.titre}>OGDC</Text>
            </View>
            <View style={styles.section_bas}>
                <View>
                    <Text >Nom d'utilisateur</Text>
                    <TextInput style={styles.saisie}
                        onChangeText={(v) => {
                            setUsername(v);
                        }}
                    />
                    <Text >Mot de passe</Text>
                    <TextInput style={styles.saisie}
                        secureTextEntry={true}
                        onChangeText={(v) => {
                            console.log("init textInpit %s", v)
                            setPassword(v);
                        }}
                    />
                </View>
                <Bouton texte={"Se connecter"} onPress_cb={seConnecter} />
            </View>
        </View>
    );
}

export function AideScreen({ navigation }) {
    return (
        <View style={stylesCommuns.app}>
            <View style={styles.section_haut}>
                <Text style={styles.titre}>Problèmes communs reliés à l'authentification</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section_haut: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    section_bas: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    titre: {
        fontSize: 48,
    },
    créer_compte: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10
    },
    se_connecter: {
        fontSize: 18,
    },
    saisie: {
        width: 250,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "darkslategray",
    },
});