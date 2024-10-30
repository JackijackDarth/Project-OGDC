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
import { useState, useEffect } from "react";
import { obtenirObjets, obtenirUser, creerFamille } from "../utils";
import stylesCommuns from "../styles";
import { AntDesign } from "@expo/vector-icons";

import ItemMenu from "./ItemMenu";
import Tuilerie from "./Tuilerie";
import Button from "./Button";

import { obtenirUneCommandeJSON, deconnexion } from "../utils";

export function CommandeInfoScreen({ navigation, route }) {
  const currentId = route.params.currentuser.Id;
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="logout"
          size={25}
          color="blue"
          onPress={() => {
            {
              deconnexion(route.params.currentuser.Id);
              navigation.replace("Authen");
            }
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={stylesCommuns.app}>
      <Text>Page en dévelopement!</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("MenuFamille", { usrid: currentId })}
      >
        <Text style={styles.buttonText}>Créer famille</Text>
      </Pressable>
    </View>
  );
}

export function MenuFamilleScreen({ route, navigation }) {
  const [NomFamille, setFamilleNom] = useState(null);
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const { usrid } = route.params;

  function CreationFamille() {
    if (NomFamille!=null && /\S/.test(NomFamille)) {
      creerFamille({ name: NomFamille, idOwner: usrid })
        .then((res) => {
          console.log("creation réussi %s", res);
          setInvalidbool(false);
          setErrorMsg("");
          navigation.goBack();
        })
        .catch((err) => {
          console.log(err);
          console.log("creation échec: %s", err);
          setErrorMsg("Ce nom de famille n'est pas disponible");
          setInvalidbool(true);
        });
    } else {
      setInvalidbool(true);
      setErrorMsg("Veuiller entrer quelque chose avant de procéder");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "padding"}
      style={styles.formBox}
      contentContainerStyle={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Entrez un nom pour votre groupe famille
        </Text>
        <TextInput
          style={styles.input}
          backgroundColor={invalidbool ? "rgba(255, 0, 0, 0.4)" : null}
          placeholder="Nom de la famille"
          onChangeText={setFamilleNom}
          value={NomFamille}
        />
        <Text style={styles.msgerreur}>{errormsg}</Text>
        <Pressable onPress={CreationFamille} style={styles.button}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  section_haut: {
    flex: 1 / 3,
    justifyContent: "center",
  },
  section_bas: {
    flex: 2 / 3,
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
    gap: 30,
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
