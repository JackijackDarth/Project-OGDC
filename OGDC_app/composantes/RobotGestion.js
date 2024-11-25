import { StyleSheet, Text, View, Pressable, FlatList, Image, SafeAreaView, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import stylesCommuns from '../styles';
import { nbItemPanier, obtenirPanier } from '../panier';
import { obtenirRobotsJSON, ConnecterRobot, obtenirUser } from '../utils';
import Tuilerie from "./Tuilerie";




////////////////////
//AccueilScreen//
///////////////////
export function AccueilScreen({ navigation, route }) {
  const [menuJSON, setMenu] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const usrId = route.params.usrId; 
  const [currentuser, setCurrentUser] = useState(null); 
  console.log(currentuser)
   //Get les robot//
  useEffect(() => {
    obtenirRobotsJSON().then((menu) => setMenu(menu));
  }, []);
  
  //GET le user actuel//
  useEffect(() => {
    if (usrId) {
      obtenirUser(usrId).then((user) => {

        setCurrentUser(user);  
      }).catch(err => {
        console.error("Failed to fetch user:", err);
      });
    }
  }, [usrId]);


//renderItem ou Item a supprimer. ne pas toucher pour le moment
  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View>
      <Tuile texte={item.username} iconNom={currentuser?.idRobot === item.Id ? "checkcircleo" : "pluscircleo"} onPress_cb={() => {if (currentuser.idRobot != item.Id) {
          navigation.navigate("AjoutRobot", {
            usrId: currentuser.Id,
            currentuser:currentuser,
            rbtId: item.Id,
          });
        } else {
          alert("Ce robot vous est déjà associé!");
        }
      }}/>
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.Id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.Id === selectedId ? 'white' : 'black';
    return (
      <Item
        item={item}
        onPress={() => navigation.navigate("AjoutRobot", {
          usrId: usrId,
          currentuser:currentuser,
          rbtId: item.Id,
        })}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };


  //Affichage//
  return (
    <View style={stylesCommuns.app}>
      <View style={styles.section_haut}>
      </View>
      <Tuilerie>
        <SafeAreaView style={styles.section_bas}>
          <FlatList
            data={menuJSON}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={item => item.Id}
            extraData={selectedId}
          />
        </SafeAreaView>
      </Tuilerie>
    </View>
  );
}




////////////////////
//AjoutRobotScreen//
///////////////////
export function AjoutRobotScreen({ route, navigation }) {
  const [MdpRbt, setPassword] = useState(null);
  const [connectionmsg, setConnectionmsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const { rbtId,currentuser,usrId } = route.params;
  console.log(route)
  //Actions qui se produit quand on clique sur connect//
  function ConnectionRobot() {
    if (MdpRbt) {
      ConnecterRobot(usrId, rbtId, MdpRbt).then((res) => {
        console.log("Creation réussi %s", route);
        setInvalidbool(false);
        setConnectionmsg(null);
        navigation.dispatch({
          type: 'REPLACE',
          payload: {
            name: 'MainTabs',   
            params: {
                  currentuser : currentuser
            },
          },
        })
      }).catch(err => {
        console.log("Creation échec: %s", err);
        setInvalidbool(true);
        setConnectionmsg("Un problème est survenu lors de la connexion");
      });
    } else {
      setInvalidbool(true);
      setConnectionmsg("Veuillez entrer le NIP du robot!");
    }
  }

  //Affichage menu remplire le code etc
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "height"}
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
