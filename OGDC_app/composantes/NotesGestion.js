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
import { useState, useEffect,useCallback } from "react";
import {creerNote,ObtenirNote,deleteNote,obtenirUser,getInfosFamille } from "../utils";
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
    if (NomFamille!=null && /\S/.test(NomFamille)) {
      creerNote({idUser:currentId,message:NomFamille})
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
      }
      else{
        setNotesFamille([])
      }
    });
    return unsubscribe;
  }, [navigation,route,currentId,NomFamille]); 
  
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
      <Tuile texte={item.message} iconNom="solution1" onPress_cb={() => {Alert.alert('Suppression', 'Voulez vous supprimer cette note?', [
      {
        text: 'Annuler',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Ok', onPress: () => {deleteNote(item.Id); fetchNotes()}},
    ]);}} />
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.Id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.Id === selectedId ? 'white' : 'black';
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
    <View style={stylesCommuns.app}>
        <Text style={stylesnote.title}>
          Ajouter une note
        </Text>
      <View style={stylesnote.section}>
        <Text style={styles.subtitle}>
          Ajouter une note
        </Text>
        <TextInput
          style={styles.input}
          backgroundColor={invalidbool ? "rgba(255, 0, 0, 0.4)" : null}
          placeholder="Message de la note"
          onChangeText={setFamilleNom}
        />
        <Text style={styles.msgerreur}>{errormsg}</Text>
        <Pressable onPress={AjouterNote} style={styles.button}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </Pressable>
      </View>


      <View style={styles}>
        {/* <Text style={styles.bienvenue}>Welcome {currentuser.username}</Text>  */}
      </View>
      <Tuilerie>
        <SafeAreaView style={styles.section_bas}>
          <FlatList
            data={NotesFamille}
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
  section_bas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bienvenue: {
    fontSize: 22,
    textAlign: "center",
  },
  tuile: {
    flex: 0,
    height: 150,
    width: 150,
    margin: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    shadowColor: "#000",
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
    backgroundColor: "#f1f7fe",
    overflow: "hidden",
    borderRadius: 16,
    color: "#010101",
    alignSelf: `stretch`,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
     
    textAlign: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  formContainer: {
    gap: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 45,
    width: "100%",
    padding: 10,
  },
  input: {
    backgroundColor: "none",
    borderWidth: 0,
    outlineWidth: 0,
    height: 44,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 0,
  },
  button: {
    backgroundColor: "#0066ff",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  msgerreur: {
    color: "red",
    fontSize: 20,
    marginTop: 10,
  },
  item: {
    backgroundColor: "#98de9c",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  itemStatus: {
    fontSize: 14,
    color: "gray",
  },
});

const stylesnote = StyleSheet.create({
  section: {
    padding: 20,
    backgroundColor: "#f1f7fe",
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#555",
    marginBottom: 15,
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
  },
  input: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "rgba(255, 0, 0, 0.4)",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  createFamilyButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  createFamilyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#0066ff",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});