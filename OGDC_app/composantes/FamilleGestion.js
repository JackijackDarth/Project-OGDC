import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform
  } from "react-native";
  import { useState, useEffect } from "react";
  import { obtenirUser, creerFamille, joinFamille, getInfosFamille, deconnexion } from "../utils";
  import { AntDesign } from "@expo/vector-icons";
  import stylesCommuns from "../styles";
  
  export function FamillymanageScreen({ navigation, route }) {
    const [NomFamille, setFamilleNom] = useState(null);
    const [InfosFamille, setInfosFamille] = useState(null);
    const [MdpFamille, setMdpFamille] = useState(null);
    const [errormsg, setErrorMsg] = useState(null);
    const [invalidbool, setInvalidbool] = useState(false);
    const [currentuser, setCurrentUser] = useState(null);
    const currentId = route.params.currentuser.Id;
  
    //du fouiller en ligne pomal pour trouver comment refresh apres join une famille
    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        obtenirUser(currentId)
          .then((user) => setCurrentUser(user))
          .catch((err) => console.error("Failed to fetch user:", err));
      });
      return unsubscribe;
    }, [navigation]);
  
    
    useEffect(() => {
      if (currentuser && currentuser.idFamille) {
        getInfosFamille(currentuser.idFamille)
          .then((famille) => setInfosFamille(famille))
          .catch((err) => console.error("Failed to fetch famille:", err));
      } else {
        setInfosFamille(null);
      }
    }, [currentuser]);
  
  
    function RejoindreFamille() {
      if (NomFamille && /\S/.test(NomFamille)) {
        joinFamille(currentId, { nomFamille: NomFamille, passFamille: MdpFamille })
          .then(() => {
            setInvalidbool(false);
            setErrorMsg("Vous avez rejoint la famille " + NomFamille);
            obtenirUser(currentId)  
              .then((user) => setCurrentUser(user))
              .catch((err) => console.error("Failed to fetch updated user:", err));
          })
          .catch((err) => {
            console.log(err);
            setErrorMsg("Ce nom de famille n'est pas disponible");
            setInvalidbool(true);
          });
      } else {
        setInvalidbool(true);
        setErrorMsg("Veuillez entrer un nom de famille avant de procéder");
      }
    }
  
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
  

    if (currentuser) {
      if (!currentuser.idFamille && InfosFamille) {
        return (
          <SafeAreaView style={stylesCommuns.app}>
            <View style={styles.section}>
              <Text style={styles.title}>Vous êtes membre de la famille {InfosFamille.name}</Text>
            </View>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView style={stylesCommuns.app}>
            <View style={styles.section}>
              <Text style={styles.title}>Gestion de la Famille</Text>
              <View style={styles.formContainer}>
                <Text style={styles.subtitle}>Rejoindre une Famille</Text>
                <TextInput
                  style={[styles.input, invalidbool && styles.inputError]}
                  placeholder="Nom de la famille"
                  onChangeText={setFamilleNom}
                  value={NomFamille}
                />
                <TextInput
                  style={[styles.input, invalidbool && styles.inputError]}
                  placeholder="Mot de passe de la famille"
                  onChangeText={setMdpFamille}
                  value={MdpFamille}
                  secureTextEntry
                />
                {errormsg && <Text style={styles.errorText}>{errormsg}</Text>}
                <Pressable onPress={RejoindreFamille} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                </Pressable>
              </View>
              <Text style={styles.title}> OU </Text>
              <View style={styles.formContainer}>
                <Text style={styles.subtitle}>Créer une Famille</Text>
                <Pressable
                  style={styles.createFamilyButton}
                  onPress={() => navigation.navigate("MenuFamille", { usrid: currentId })}
                >
                  <Text style={styles.createFamilyButtonText}>Créer une Famille</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        );
      }
    }
  }
  
  
  export function MenuFamilleScreen({ route, navigation }) {
    const [NomFamille, setFamilleNom] = useState(null);
    const [errormsg, setErrorMsg] = useState(null);
    const [invalidbool, setInvalidbool] = useState(false);
    const { usrid } = route.params;
  
    function CreationFamille() {
      if (NomFamille != null && /\S/.test(NomFamille)) {
        creerFamille({ name: NomFamille, idOwner: usrid })
          .then((res) => {
            console.log("Création réussie %s", res);
            setInvalidbool(false);
            setErrorMsg("Vous avez créé la famille " + NomFamille);
            navigation.goBack();
          })
          .catch((err) => {
            console.log(err);
            setErrorMsg("Ce nom de famille n'est pas disponible");
            setInvalidbool(true);
          });
      } else {
        setInvalidbool(true);
        setErrorMsg("Veuillez entrer un nom pour la famille avant de procéder");
      }
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <Text style={styles.title}>Création d'une Nouvelle Famille</Text>
        <Text style={styles.description}>
          Entrez un nom pour votre groupe famille et validez pour créer la famille.
        </Text>
        <TextInput
          style={[styles.input, invalidbool && styles.inputError]}
          placeholder="Nom de la famille"
          onChangeText={setFamilleNom}
          value={NomFamille}
        />
        {errormsg && <Text style={styles.errorText}>{errormsg}</Text>}
        <Pressable onPress={CreationFamille} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Créer</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
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
  