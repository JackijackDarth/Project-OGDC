
import { StyleSheet, Text, View, Pressable, FlatList, Image ,SafeAreaView,StatusBar,TouchableOpacity,KeyboardAvoidingView,Platform, TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import stylesCommuns from '../styles';
import { nbItemPanier, obtenirPanier } from '../panier';
import Tuilerie from './Tuilerie';
import { obtenirRobotsJSON, ConnecterRobot, obtenirUser } from '../utils';


export function AccueilScreen({ navigation, route }) {
  const [menuJSON, setMenu] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const { nom, usrId} = route.params;
  const [currentuser, setCurrentUser] = useState();
  const [nbItemsPanier, setNbItemsPanier] = useState(nbItemPanier());

  // useEffect(() => {//jai du chercher un peu pour trouver cela... je ne sais pas si il sagit de la bonne facon mais je ne trouvais pas comment rafraichire
  //   return navigation.addListener('focus', () => {
  //     setNbItemsPanier(nbItemPanier());
  //   });
  //   ;
  // }, [navigation]);
  useEffect(() => {
    obtenirRobotsJSON().then(menu => setMenu(menu));
  }, []);
  useEffect(() => {
    obtenirUser(usrId).then(user => setCurrentUser(user));
  },[]);
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
  console.log(currentuser);
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => nbItemsPanier > 0 && (
  //       <AntDesign name="shoppingcart" size={25}
  //         color="blue"
  //         onPress={() => {
  //           navigation.navigate("Panier");
  //         }}
  //       />
  //     ),
  //   });
  // }, [nbItemsPanier, navigation]);
  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <View>
      <Tuile texte={item.username} iconNom="book" onPress_cb={() =>  navigation.navigate("AjoutRobot", {
          usrId : usrId,
          rbtId: item.Id,
      })} />
      </View>
    
  );
  const renderItem = ({item}) => {
    const backgroundColor = item.Id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.Id === selectedId ? 'white' : 'black';
    console.log(item)
    return (
      <Item
        item={item}
        // onPress={() => setSelectedId(item.Id)}
        onPress={() =>  navigation.navigate("AjoutRobot", {
          usrId : usrId,
          rbtId: rbtId,
      })}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  return (
    <View style={stylesCommuns.app}>
      <View style={styles.section_haut}>
        <Text style={styles.bienvenue}>welcome {nom}</Text>
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

export function AjoutRobotScreen({ route, navigation }) {
  const [MdpRbt, setPassword] = useState(null);
  const [connectionmsg, setConnectionmsg] = useState(null)
  const [invalidbool, setInvalidbool] = useState(false);
  const { rbtId, usrId} = route.params;
  function ConnectionRobot() {
      if (MdpRbt) {
          ConnecterRobot(usrId, rbtId, MdpRbt).then((res) => {
              console.log("creation réussi %s", res);
              setInvalidbool(false);
              setConnectionmsg(null);
              navigation.goBack()
          }).catch(err => {
              console.log("creation échec: %s", err.msg);
              setInvalidbool(true);
              setConnectionmsg("Un problème est survenu lors de la connection");

          });
      }
      else {
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
              <Text style={styles.subtitle}>Veuiller entrer le NIP du robot</Text>
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
          <View style={styles.formSection}>
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
      <Text>{}</Text>
    </Pressable>
  )
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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