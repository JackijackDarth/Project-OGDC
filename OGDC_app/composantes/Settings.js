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
import { obtenirObjets, obtenirUser, creerFamille, joinFamille } from "../utils";
import stylesCommuns from "../styles";
import { AntDesign } from "@expo/vector-icons";

import Tuilerie from "./Tuilerie";

import { obtenirUneCommandeJSON, deconnexion } from "../utils";

export function SettingsScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Gestion de la Famille",
      headerRight: () => (
        <AntDesign
          name="logout"
          size={25}
          color="blue"
          onPress={() => {
            deconnexion(route.params.currentuser.Id);
            navigation.replace("Authen");
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={stylesCommuns.app}>
      <Text>Page en dévelopement!</Text>
      <Text>La gestion de famille a maintenant une page a elle!!!</Text>
      <View style={styles.formContainer}>
                
                <Pressable
                  style={styles.createFamilyButton}
                  onPress={() => alert("delete de user famille et quitter une famille en dev")}
                >
                  <Text style={styles.createFamilyButtonText}>Options de famille</Text>
                </Pressable>
              </View>
    </View>
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
    backgroundColor: "#ccc",
    marginVertical: 45,
    width: "30%",
    padding: "auto",
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
