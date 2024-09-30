import { StyleSheet, Text, View, Pressable, FlatList, Image, SafeAreaView, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import stylesCommuns from '../styles';
import { nbItemPanier, obtenirPanier } from '../panier';
import Tuilerie from './Tuilerie';
import { obtenirRobotsJSON, ConnecterRobot, obtenirUser, obtenirObjets} from '../utils';

const mapcouleur = {
  "Déjeuner": "#98de9c",
  "Sandwichs": "#98b7de",
  "Salades": "#de98da",
  "Smoothies": "#debf98",
  "Breuvages": "#de9c98",
};


export default function ArdoiseScreen({ navigation, route }) {
  const [menuJSON, setMenu] = useState();
  const [selectedId, setSelectedId] = useState();
  const currentuser  = route.params.currentuser;
  const [nbItemsPanier, setNbItemsPanier] = useState(nbItemPanier());

  useEffect(() => {
    console.log(currentuser.rbtId)
    obtenirObjets(currentuser.rbtId).then(items => setMenu(items));
    console.log("les obj",menuJSON)
  },);
  
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign name="logout" size={25}
          color="blue"
          onPress={() => {
            navigation.replace("Authen");
          }}
        />
      ),
    });
  }, [navigation]);

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View>
      <Tuile texte={item.username} iconNom="pluscircleo" onPress_cb={() => navigation.navigate("AjoutRobot", {
          usrId: usrId,
          rbtId: item.Id,
      })} />
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
          rbtId: item.Id,
        })}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={stylesCommuns.app}>
      <View style={styles.section_haut}>
        <Text style={styles.bienvenue}>Welcome </Text>
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
function Catégorie({ titre, children }) {
  
  return (
    <View style={[styles.section,{ backgroundColor: "#98de9c" }]}>
      <Text>{titre}</Text>
      <ScrollView horizontal>
        {children}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  sectionDesc: {
    textAlign: 'left',
    fontSize: 22,
  },
  section: {
    margin: 5,
  },
  boutton:{
    alignItems:"center"
  }
});