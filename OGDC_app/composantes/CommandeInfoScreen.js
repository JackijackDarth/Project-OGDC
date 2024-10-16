import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { obtenirObjets, obtenirUser } from '../utils';
import stylesCommuns from '../styles';
import { AntDesign } from '@expo/vector-icons';

import ItemMenu from './ItemMenu';
import Tuilerie from './Tuilerie';

import { obtenirUneCommandeJSON, deconnexion } from '../utils';
 

export default function CommandeInfoScreen({ navigation,route }) {

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <AntDesign name="logout" size={25}
              color="blue"
              onPress={() => {{
                deconnexion(route.params.currentuser.Id)
                navigation.replace("Authen");}
              }}
            />
          ),
        });
      }, [navigation]);


    return (
        <View style={stylesCommuns.app}>
           <Text>Page en dévelopement!</Text>
        </View>
    );
}

export function MenuObjetScreen({ route, navigation }) {
    const [MdpRbt, setPassword] = useState(null);
    const [connectionmsg, setConnectionmsg] = useState(null);
    const [invalidbool, setInvalidbool] = useState(false);
    const { rbtId, usrId } = route.params;
  
    function ConnectionRobot() {
      if (MdpRbt) {
        ConnecterRobot(usrId, rbtId, MdpRbt).then((res) => {
          console.log("Creation réussi %s", route.params);
          setInvalidbool(false);
          setConnectionmsg(null);
          navigation.navigate("Ardoise");
        }).catch(err => {
          console.log("Creation échec: %s", err.msg);
          setInvalidbool(true);
          setConnectionmsg("Un problème est survenu lors de la connexion");
        });
      } else {
        setInvalidbool(true);
        setConnectionmsg("Veuillez entrer le NIP du robot!");
      }
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formBox}
      >
        <View style={styles.form}>
          <Text style={styles.subtitle}>Veuillez entrer le NIP du robot</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              backgroundColor={invalidbool ? 'rgba(255, 0, 0, 0.4)' : null}
              placeholder="NIP du robot"
              secureTextEntry={true}
              onChangeText={setPassword}
              value={MdpRbt}
              inputMode='numeric'
            />
          </View>
          <Text style={styles.msgerreur}>{connectionmsg}</Text>
          <Pressable onPress={ConnectionRobot} style={styles.button}>
            <Text style={styles.buttonText}>Connecter</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  export function Thumbnail({ Nom, thumb_cb }) {
    function onClick_cb(e) {
      if (thumb_cb !== null && thumb_cb !== undefined)
        thumb_cb();
    }
    return (
      <Pressable style={styles.thumbnail} onPress={onClick_cb}>
        <Text>{Nom}</Text>
      </Pressable>
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
      flex: 1 / 3,
      justifyContent: "center"
    },
    section_bas: {
      flex: 2 / 3,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
      padding: 10,
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
    msgerreur: {
      color: 'red',
      fontSize: 20,
      marginTop: 10,
    },
    
  });