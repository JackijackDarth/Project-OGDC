import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { deconnexion } from "../utils";

export function SettingsScreen({ navigation, route }) {

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          deconnexion(route.params.currentuser.Id);
          navigation.replace("Authen");
        }}
      >
        <AntDesign name="logout" size={30} color="white" />
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
