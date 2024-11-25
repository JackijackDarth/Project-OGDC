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
  Modal,
  TouchableOpacity
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
  const [selectedNote, setSelectedNote] = useState(null);
  const [InfosFamille, setInfosFamille] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);
  const currentId = route.params.currentuser.Id;

  useEffect(() => {
    obtenirUser(currentId)
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed fetch user:", err));
  }, [navigation,route]);

  useEffect(() => {
    if (CurrentUser?.idFamille) {
      ObtenirNote(CurrentUser.idFamille)
        .then((notes) => setNotesFamille(notes))
        .catch((err) => console.error("Error obtention notes:", err));
    } else {
      setNotesFamille([]);
    }
  }, [navigation, route, CurrentUser]);

  const fetchNotes = useCallback(() => {
    if (CurrentUser?.idFamille) {
      ObtenirNote(CurrentUser.idFamille)
        .then((notes) => setNotesFamille(notes))
        .catch((err) => console.error("Error obtention notes:", err));
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
      onPress={() => setSelectedNote(item)}
      onLongPress={() =>
        Alert.alert("Supprimer", "Voulez-vous supprimer cette note ?", [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer", style:"destructive",
            onPress: () => deleteNote(item.Id).then(fetchNotes),
          },
        ])
      }
    >
      <AntDesign name="filetext1" size={40} color="#555" />
      <Text style={styles.title}>{item.name} :</Text>
      <Text numberOfLines={1} style={styles.noteText}>{item.message}</Text>
    </Pressable>
  );

  if (NotesFamille) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.headertitle}>Les Notes</Text>

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
        <Modal
  visible={!!selectedNote}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setSelectedNote(null)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedNote?.name}</Text>
      <Text style={styles.modalText}>{selectedNote?.message}</Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.modalDeleteButton}
          onPress={() => {
            Alert.alert(
              "Supprimer",
              "Voulez-vous supprimer cette note ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: () => {
                    deleteNote(selectedNote.Id)
                      .then(() => {
                        setSelectedNote(null); // Close modal
                        fetchNotes(); // Refresh notes
                      })
                      .catch((err) => console.error("Erreur suppression:", err));
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.modalDeleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => setSelectedNote(null)}
        >
          <Text style={styles.modalCloseButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


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
    marginBottom: 1,
    textAlign: "center",
  },
  headertitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -10,
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
    height: 35,
    color: "#333",
    textAlign: "center",
    overflow:"hidden",
  },
  inputContainer: {
    marginBottom:5,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalDeleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  modalDeleteButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalCloseButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  
});
