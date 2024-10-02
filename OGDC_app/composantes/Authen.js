import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, View, Pressable, TextInput } from 'react-native';
var validate = require("react-email-validator");
import { useState, useEffect } from 'react';
import { Bouton } from './BarreOutils'; // Assuming BarreOutils has a Bouton component
 
import { connecterUtilisateur, creerUtilisateurJSON,obtenirUserUsrnm } from '../utils';

export function AuthenScreen({ navigation }) {
    const [surname, setSurname] = useState(null);
    const [mail, setMail] = useState(null);
    const [name, setName] = useState(null);
    const [connectionmsg, setConnectionmsg] = useState(null);
    const [invalidbool, setInvalidbool] = useState(false);


    function compte() {
        emailvalide = validate.validate(mail)
        if (surname && mail && name && emailvalide) {
            setInvalidbool(false);
            setConnectionmsg(null);
            navigation.navigate("CreeCompte", {
                surname: surname,
                name: name,
                mail: mail
            });
        }
       
        else {
            setInvalidbool(true);

            // else {
            if (!mail) {
                setConnectionmsg("Veuillez entrer une adresse couriel!");
            }
            if (!emailvalide) {
                setConnectionmsg("Email invalide");
            }
            if (!name) {
                setConnectionmsg("Veuillez entrer un nom!");
            }
            if (!surname) {
                setConnectionmsg("Veuillez entrer un prénom!");
            }
            // }


        }
    }

    function seConnecter() {
        setInvalidbool(false);
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
                        style={[styles.input,]}
                        backgroundColor={invalidbool && !surname ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Prenom"
                        onChangeText={setSurname}
                        value={surname}
                        textContentType='givenName'
                        inputMode='text'
                    />
                    <TextInput
                        style={styles.input}
                        backgroundColor={invalidbool && !name ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Nom"
                        onChangeText={setName}
                        value={name}
                        textContentType='familyName'
                        inputMode='text'

                    />
                    <TextInput
                        style={styles.input}
                        backgroundColor={invalidbool && !mail ||invalidbool && !validate.validate(mail) ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Email"
                        onChangeText={setMail}
                        value={mail}
                        autoCapitalize="none"
                        textContentType='emailAddress'
                        inputMode='email'
                    />
                </View>
                <Text style={styles.msgerreur}>{connectionmsg}</Text>
                <Pressable onPress={compte} style={styles.button}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </Pressable>
            </View>
            <View style={styles.formSection}>
                <Text>Have an account? <Text style={styles.link} onPress={seConnecter}>Log in</Text></Text>
            </View>

        </KeyboardAvoidingView>
    );
}

export function CreeCompteScreen({ route, navigation }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [phone, setPhone] = useState(null);
    const [connectionmsg, setConnectionmsg] = useState(null)
    const [invalidbool, setInvalidbool] = useState(false);
    const [valideusrname, setUsrnmValidBool] = useState(true);
    const [currentusrnm, setCurrentUsrnm] = useState();
    const { mail, name, surname } = route.params;
    const formatPhoneNumber = (str) => {
        let numbers = str.replace(/\D/g, '')
        if (numbers.length > 6) {
          return '(' + numbers.substr(0, 3) + ') ' + numbers.substr(3, 3) + '-' + numbers.substr(6)
        } else if (numbers.length > 3) {
          return '(' + numbers.substr(0, 3) + ') ' + numbers.substr(3)
        } else if (numbers.length >= 1) {
          return '(' + numbers  
        }
        return numbers
      }
    function creerCompte() {
        if (password && phone) {
            setInvalidbool(false);
            let nouvUtilisateur = {
                prenom: surname,
                nom: name,
                username: username,
                pass: password,
                mail: mail,
                phone: phone,
                isLogin: false, 
            }
           
            creerUtilisateurJSON(nouvUtilisateur).then((res) => {
                console.log("creation réussi %s", res);
                obtenirUserUsrnm(nouvUtilisateur.username).then((user) => {
                    console.log("ahhhh:",user);
                    console.log("le user :",user);
                    navigation.popToTop();
                    navigation.dispatch({
                        type: 'REPLACE',
                        payload: {
                          name: 'MainTabs',    
                          params: {
                                currentuser : user
                          },
                        },
                      });
                  }).catch(err => {
                    console.error("Failed to fetch user:", err);
                  });
                
                    
                
               
                // navigation.replace("Accueil", { nom: res.nom, usrId : res.Id});
            }).catch(err => {
                console.log("creation échec: %s", err.msg);
                setInvalidbool(true);
                // setConnectionmsg("Ce nom d'utilisateur ou ce couriel existe déja");
                // setUsrnmValidBool(false);

            });
        }
        else {
            setInvalidbool(true);
                // if (!password.length < 8){
                //     setConnectionmsg("Veuillez entrer un mot de passer plus gros!");
                // }
                if (!username) {
                    setConnectionmsg("Veuillez entrer un nom d'utilisateur!");
                }
                if (!password) {
                    setConnectionmsg("Veuillez entrer un mot de passe!");
                }
                if (!phone) {
                    setConnectionmsg("Veuillez entrer un numero de telephone!");
                }
            
        }
    }
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formBox}
        >
            <View style={styles.form}>
                <Text style={styles.subtitle}>Veuiller aussi remplir les infos suivantes.</Text>
                <View style={styles.formContainer}>

                    <TextInput
                        style={styles.input}
                        backgroundColor={invalidbool && !username || !valideusrname ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Nom d'utilisateur"
                        onChangeText={setUsername}
                        value={username}
                        textContentType='username'

                    />
                    <TextInput
                        style={styles.input}
                        backgroundColor={invalidbool && !phone ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Telephone"
                        onChangeText={(str) => setPhone(formatPhoneNumber(str))}
                        value={phone}
                        maxLength={14}
                        inputMode='tel'
                        textContentType='telephoneNumber'
                    />
                     
                    <TextInput
                        style={styles.input}
                        backgroundColor={invalidbool && !password ? 'rgba(255, 0, 0, 0.4)' : null}
                        placeholder="Mot de passe"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        textContentType='newPassword'
                    />
                </View>
                <Text style={styles.msgerreur}>{connectionmsg}</Text>
                <Pressable onPress={creerCompte} style={styles.button}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </Pressable>
                
            </View>
            <View style={styles.formSection}>
            </View>

        </KeyboardAvoidingView>
    );
}

export function SeConnecterScreen({ navigation }) {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("password");
    const [connectionmsg, setConnectionmsg] = useState(null);
    const [invalidbool, setInvalidbool] = useState(false);
 

    function seConnecter() {
        connecterUtilisateur(username, password).then((res) => {
            navigation.popToTop();
            navigation.dispatch({
                type: 'REPLACE',
                payload: {
                  name: 'MainTabs',   
                  params: {
                        nom: res.nom, usrId : res.Id, currentuser : res
                  },
                },
              });
        })
            .catch(err => {
                console.log("login failed: %s", err);
                setConnectionmsg("Mot de passe/nom d'utilisateur invalide!");
                setInvalidbool(true);
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
                        backgroundColor={invalidbool ? 'rgba(255, 0, 0, 0.4)' : null}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        backgroundColor={invalidbool ? 'rgba(255, 0, 0, 0.4)' : null}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>
                <Text style={styles.msgerreur}>{connectionmsg}</Text>
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
        alignSelf: 'center',
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
    msgerreur: {
        color: 'red',
        fontSize: 20,
    },
    boxerreur: {
        backgroundColor: 'red'
    }
});
