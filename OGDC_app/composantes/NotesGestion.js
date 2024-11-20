import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { creerNote, ObtenirNote, deleteNote, obtenirUser } from "../utils";

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
    obtenirUser(currentId)
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [navigation,route]);

  useEffect(() => {
    if (CurrentUser?.idFamille) {
      ObtenirNote(CurrentUser.idFamille)
        .then((notes) => setNotesFamille(notes))
        .catch((err) => console.error("Error fetching notes:", err));
    } else {
      setNotesFamille([]);
    }
  }, [navigation, route, CurrentUser]);

  const fetchNotes = useCallback(() => {
    if (CurrentUser?.idFamille) {
      ObtenirNote(CurrentUser.idFamille)
        .then((notes) => setNotesFamille(notes))
        .catch((err) => console.error("Error fetching notes:", err));
    }else {
      setNotesFamille([]);
    }
    
  }, [CurrentUser?.idFamille]);

  useFocusEffect(
    useCallback(() => {
      const intervalId = setInterval(fetchNotes, 500);
      fetchNotes();
      return () => clearInterval(intervalId);
    }, [fetchNotes])
  );

  function AjouterNote() {
    if(CurrentUser.idFamille){
    if (NomFamille != null && /\S/.test(NomFamille)) {
      creerNote({ idUser: currentId, message: NomFamille })
        .then((response) => {
          setInvalidbool(false);
          setErrorMsg("");
          setFamilleNom("");
          Keyboard.dismiss();
        })
        .catch((err) => {
          console.log("Erreur dans la création de la note:", err);
          setInvalidbool(true);
        });
    } else {
      setInvalidbool(true);
      setErrorMsg("Veuiller entrer quelque chose avant de procéder");
    }}else{
      setInvalidbool(true);
      setErrorMsg("Vous ne faite pas parti d'une famille!");
    }
  }

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.noteTile}
      onLongPress={() =>
        Alert.alert("Supprimer", "Voulez-vous supprimer cette note ?", [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            onPress: () => deleteNote(item.Id).then(fetchNotes),
          },
        ])
      }
    >
      <AntDesign name="filetext1" size={40} color="#555" />
      <Text style={styles.noteText}>{item.name} : {item.message}</Text>
    </Pressable>
  );

  if (NotesFamille) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.title}>Les Notes</Text>

        <FlatList
          style={styles.notesList}
          data={NotesFamille.slice().reverse()}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.Id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyList}>Aucune note pour le moment.</Text>
          }
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ajouter une note</Text>
          <TextInput
            style={[
              styles.input,
              invalidbool && { borderColor: "red", backgroundColor: "#ffe6e6" },
            ]}
            placeholder="Message de la note"
            value={NomFamille}
            onChangeText={setFamilleNom}
          />
          {invalidbool && <Text style={styles.errorText}>{errormsg}</Text>}
          <Pressable style={styles.addButton} onPress={AjouterNote}>
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  } else {
    return <ActivityIndicator size={20} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  notesList: {
    flex: 1,
    marginVertical: 8,
  },
  emptyList: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  noteTile: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
