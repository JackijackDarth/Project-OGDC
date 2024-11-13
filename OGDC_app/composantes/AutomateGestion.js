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

export function AutomateScreen({ navigation, route }) {
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);
  const currentId = route.params.currentuser.Id;

  

  return (
    <View style={styles.card}>
      <Text style={styles.title}>En dévelopement</Text>
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
