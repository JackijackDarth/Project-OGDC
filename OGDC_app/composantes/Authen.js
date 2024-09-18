import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, View, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Bouton } from './BarreOutils'; // Assuming BarreOutils has a Bouton component

import { obtenirAuthenJSON } from '../utils';

export function AuthenScreen({ navigation }) {

    function créerCompte() {
        console.log("A faire");
    }

    function seConnecter() {
        navigation.navigate("SeConnecter");
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formBox}
    >
         
            
                <View style={styles.form}>
                    <Text style={styles.title}>Sign up</Text>
                    <Text style={styles.subtitle}>Créer vous un compte gratuit avec votre email.</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom d'utilisateur"
                            onChangeText={créerCompte}
                            value=""
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={créerCompte}
                            value=""
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry={true}
                            onChangeText={créerCompte}
                            value=""
                        />
                    </View>
                    <Pressable onPress={créerCompte} style={styles.button}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </Pressable>
                </View>
                <View style={styles.formSection}>
                    <Text>Have an account? <Text style={styles.link} onPress={seConnecter}>Log in</Text></Text>
                </View>
                 
                </KeyboardAvoidingView>
    );
}

export function SeConnecterScreen({ navigation }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    function seConnecter() {
        connecterUtilisateur(username, password).then((res) => {
            console.log("login success: %s", res);
            navigation.popToTop();
            navigation.replace("Accueil", { nom: res.nom });
        })
            .catch(err => {
                console.log("login failed: %s", err);
            });
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate("Aide")}>
                    <Text>Aide</Text>
                </Pressable>
            ),
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formBox}
        >
             
                <View style={styles.loginform}>
                    <Text style={styles.title}>Log in</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom d'utilisateur"
                            onChangeText={setUsername}
                            value={username}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                            value={password}
                        />
                    </View>
                    <Pressable onPress={seConnecter} style={styles.button}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </Pressable>
                </View>
           
        </KeyboardAvoidingView>
    );
}

export function AideScreen({ navigation }) {
    return (
        <View style={styles.formBox}>
            <View style={styles.form}>
                <Text style={styles.title}>Problèmes communs reliés à l'authentification</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formBox: {
        backgroundColor: '#f1f7fe',
        overflow: 'hidden',
        borderRadius: 16,
        color: '#010101',
        alignSelf: `stretch`,
        paddingVertical: 20,
        paddingHorizontal: 30,
        flex: 1,
        justifyContent: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
        alignSelf:'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    formContainer: {
        gap: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginVertical: 45,
        width: '100%',
    },
    input: {
        backgroundColor: 'none',
        borderWidth: 0,
        outlineWidth: 0,
        height: 44,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
        paddingHorizontal: 15,
        marginBottom: 0,
    },
    button: {
        backgroundColor: '#0066ff',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formSection: {
        paddingVertical: 16,
        fontSize: 14,
        
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: 11,
    },
    loginform: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        textAlign: 'center',
        justifyContent: 'center',
    },
    link: {
        fontWeight: 'bold',
        color: '#0066ff',
    },
});
