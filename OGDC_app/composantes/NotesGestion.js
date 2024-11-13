import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  creerNote,
  ObtenirNote,
  deleteNote,
  obtenirUser,
  getInfosFamille,
} from "../utils";
import stylesCommuns from "../styles";
import { AntDesign } from "@expo/vector-icons";
import Tuilerie from "./Tuilerie";

import { obtenirUneCommandeJSON, deconnexion } from "../utils";

export function NoteScreen({ navigation, route }) {
  const [NomFamille, setFamilleNom] = useState(null);
  const [NotesFamille, setNotesFamille] = useState(null);
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [InfosFamille, setInfosFamille] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);
  const currentId = route.params.currentuser.Id;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      obtenirUser(currentId)
        .then((user) => setCurrentUser(user))
        .catch((err) => console.error("Failed to fetch user:", err));
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (CurrentUser && CurrentUser.idFamille) {
      getInfosFamille(CurrentUser.idFamille)
        .then((famille) => setInfosFamille(famille))
        .catch((err) => console.error("Failed to fetch famille:", err));
    } else {
      setInfosFamille(null);
    }
  }, [CurrentUser]);

  function AjouterNote() {
    if (NomFamille != null && /\S/.test(NomFamille)) {
      creerNote({ idUser: currentId, message: NomFamille })
        .then((res) => {
          console.log("Join complette %s", res);
          setInvalidbool(false);
          setErrorMsg("");
        })
        .catch((err) => {
          console.log(err);
          console.log("creation échec: %s", err);
          setInvalidbool(true);
        });
    } else {
      setInvalidbool(true);
      setErrorMsg("Veuiller entrer quelque chose avant de procéder");
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (CurrentUser?.idFamille) {
        ObtenirNote(CurrentUser.idFamille)
          .then((notes) => setNotesFamille(notes))
          .catch((err) => console.error("Error fetching notes:", err));
      } else {
        setNotesFamille([]);
      }
    });
    return unsubscribe;
  }, [navigation, route, currentId, NomFamille]);

  const fetchNotes = useCallback(() => {
    if (CurrentUser?.idFamille) {
      ObtenirNote(CurrentUser.idFamille)
        .then((notes) => setNotesFamille(notes))
        .catch((err) => console.error("Error fetching notes:", err));
    }
  }, [navigation]);

  useEffect(() => {
    const intervalId = setInterval(fetchNotes, 5000);
    return () => clearInterval(intervalId);
  }, [navigation, currentId, route]);

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View>
      <Tuile
        texte={item.message}
        iconNom="solution1"
        onPress_cb={() => {
          Alert.alert("Suppression", "Voulez vous supprimer cette note?", [
            {
              text: "Annuler",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Ok",
              onPress: () => {
                deleteNote(item.Id);
                fetchNotes();
              },
            },
          ]);
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.Id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.Id === selectedId ? "white" : "black";
    return (
      <Item
        item={item}
        onPress={() => console.log("La note!")}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Les notes</Text>

      <View style={styles}>
        {/* <Text style={styles.bienvenue}>Welcome {currentuser.username}</Text>  */}
      </View>
      <Tuilerie>
        <SafeAreaView  style={styles.notes}>
          <FlatList
            data={NotesFamille}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item) => item.Id}
            extraData={selectedId}
          />
        </SafeAreaView>
      </Tuilerie>

      <View style={styles}>
        <Text style={styles}>Ajouter une note</Text>
        <TextInput
          style={styles}
          backgroundColor={invalidbool ? "rgba(255, 0, 0, 0.4)" : null}
          placeholder="Message de la note"
          onChangeText={setFamilleNom}
        />
        <Text style={styles}>{errormsg}</Text>
        <Pressable onPress={AjouterNote} style={styles}>
          <Text style={styles}>Confirmer</Text>
        </Pressable>
      </View>
    </View>
  );
}
export function Tuile({ texte, onPress_cb, iconNom }) {
  return (
    <Pressable style={styles.tuile} onPress={onPress_cb}>
      <View style={styles}>
        <AntDesign name={iconNom} size={50} color="black" />
      </View>
      <View style={styles.tuile_texte_box}>
        <Text style={styles.tuile_texte}>{texte}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 450,
    height: "100%",
    backgroundColor: "white",
    alignContent:'center'
  },
  title: {
    display:'flex',
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    backgroundColor:"red"
  },
  notes:{
    backgroundColor:'green'
  },
  tuile: {
    flex: 1,
    height: 150,
    width: 150,
    margin: 10,
    // backgroundColor: "#e0e0e0",
    backgroundColor:'orange',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent:'center'
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

});
