import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Keyboard,
  ActivityIndicator,
  modal
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  creerNote,
  ObtenirAutomate,
  deleteNote,
  obtenirUser,
  obtenirObjets,
  CreeAutomate,
  deleteAutomate,
} from "../utils";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

export function AutomateScreen({ navigation, route }) {
  const [AutoFamille, setAutoFamille] = useState(null);
  const [CurrentUser, setCurrentUser] = useState(null);
  const currentId = route.params.currentuser.Id;

  useEffect(() => {
    obtenirUser(currentId)
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [navigation]);

  const fetchAuto = useCallback(() => {
    if (currentId) {
      ObtenirAutomate(currentId)
        .then((auto) => {
          console.log(auto);
          setAutoFamille(auto);
        })
        .catch((err) => console.error("Error fetching auto:", err));
    }
  }, [CurrentUser?.idFamille]);

  useFocusEffect(
    useCallback(() => {
      const intervalId = setInterval(fetchAuto, 5000);
      fetchAuto();
      return () => clearInterval(intervalId);
    }, [fetchAuto])
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.noteTile}
      onLongPress={() =>
        Alert.alert(
          "Supprimer",
          "Voulez-vous supprimer cette automatisation ?",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              onPress: () => deleteAutomate(item.Id).then(fetchAuto),
            },
          ]
        )
      }
    >
      <View style={styles.itemContent}>
        <MaterialIcons
          name={
            item.commande.object == "button"
              ? "smart-button"
              : item.commande.object == "temperature_sensor"
              ? "device-thermostat"
              : "lightbulb-outline"
          }
          size={30}
          color="#333"
          style={styles.itemIcon}
        />
        <Text style={styles.noteText}>
          {item.commande.object} :{" "}
          <Text style={styles.itemName}>
            {item.commande.name}{" "}
            {item.commande.object == "temperature_sensor"
              ? "a " + item.commande.newValue + " degrer"
              : null}
          </Text>
        </Text>
      </View>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{item.condition.heure}</Text>
      </View>
    </Pressable>
  );

  if (AutoFamille) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Les Automatisations</Text>

        <FlatList
          style={styles.autoList}
          data={AutoFamille.slice().reverse()}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.Id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyList}>Aucune automatisation pour le moment.</Text>
          }
        />

        <Pressable
          style={styles.addAutoButton}
          onPress={() => navigation.navigate("AutoCreation", { CurrentUser })}
        >
          <MaterialIcons name="alarm-add" size={30} color="black" />
          <Text style={styles.addButtonText}> Ajouter</Text>
        </Pressable>
      </SafeAreaView>
    );
  } else {
    return <ActivityIndicator size={20} />;
  }
}

export function AutoCreationScreen({ route }) {
  const [dropdownData, setDropdownData] = useState([]);
  const [selectedobjValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const CurrentUser = route.params.CurrentUser;
  const [selected, setSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [temp, setTemp] = useState(null);

  //#region Fonctions pour initialiser et get tout ce que jai besoin
  const fetchObjects = useCallback(() => {
    if (CurrentUser && CurrentUser.idRobot != null) {
      obtenirObjets(CurrentUser.idRobot)
        .then((items) => {
          const transformedData = Object.entries(items.listeObjets)
            .map(([key, value]) => ({
              label: `${key} (${value.location})`,
              name: key,
              pin: value.pin,
              value: key,
            }))
            .filter(
              (item) =>
                item.name !== "movement_sensor" && item.name !== "camera"
            );
          setDropdownData(transformedData);
        })
        .catch(() => {
          setDropdownData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [CurrentUser]);

  useFocusEffect(
    useCallback(() => {
      const intervalId = setInterval(fetchObjects, 5000);
      fetchObjects();
      return () => clearInterval(intervalId);
    }, [fetchObjects])
  );

  useFocusEffect(
    useCallback(() => {
      fetchObjects();
    }, [fetchObjects])
  );
  //#endregion

  // #region fonction pour ajouter une auto au serveur
  function AjouterNote() {
    if (!selectedobjValue) {
      setErrorMsg("Veuillez sélectionner un objet.");
      setInvalidbool(true);
      return;
    }

    if (selected === null && temp === null) {
      setErrorMsg("Veuillez choisir l'action");
      setInvalidbool(true);
      return;
    }

    setErrorMsg(null);
    setInvalidbool(false);
    const newauto = {
      commande: {
        pin: dropdownData.find((item) => item.value === selectedobjValue)?.pin,
        name: dropdownData.find((item) => item.value === selectedobjValue)
          ?.name,
        value: (() => {
          const name = dropdownData.find(
            (item) => item.value === selectedobjValue
          )?.name;

          if (name === "temperature_sensor") {
            return temp;
          } else {
            return selected;
          }
        })(),
        userId: CurrentUser.Id,
        fonction: (() => {
          const name = dropdownData.find(
            (item) => item.value === selectedobjValue
          )?.name;

          if (name === "button") {
            return "pressButton";
          } else if (name === "temperature_sensor") {
            return "changeTemp";
          } else {
            return "switchLed";
          }
        })(),
      },
      automatisation: {
        heure: selectedDate.toLocaleTimeString("en-GB", { hour12: false }),
      },
    };
    CreeAutomate(newauto).then(() => {
      navigation.goBack();
      fetchData()
    })
    .catch((err) => {
      console.log(err);
      setErrorMsg("Quelque chose ne marche pas!");
      setInvalidbool(true);
    });;

    console.log("auto", newauto);

    setSelectedValue(null);
    setSelected(null);
  }
// #endregion

  //#region ON/OFF button manager
  function ToggleButtons() {
    return (
      <View style={stylesbtn.container}>
        <Pressable
          style={[
            stylesbtn.button,
            selected === 1
              ? stylesbtn.buttonSelected
              : stylesbtn.buttonUnselected,
          ]}
          onPress={() => setSelected(1)}
        >
          <Text
            style={[
              stylesbtn.buttonText,
              selected === 1
                ? stylesbtn.textSelected
                : stylesbtn.textUnselected,
            ]}
          >
            On
          </Text>
        </Pressable>

        <Pressable
          style={[
            stylesbtn.button,
            selected === 0
              ? stylesbtn.buttonSelected
              : stylesbtn.buttonUnselected,
          ]}
          onPress={() => setSelected(0)}
        >
          <Text
            style={[
              stylesbtn.buttonText,
              selected === 0
                ? stylesbtn.textSelected
                : stylesbtn.textUnselected,
            ]}
          >
            Off
          </Text>
        </Pressable>
      </View>
    );
  }
  //#endregion

  //#region Gestion au changement de valeur date
  const onDateChange = (event, selectedDate) => {
    console.log(selectedDate);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    } else {
      setSelectedDate(null);
    }
  };
  //#endregion

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ajouter une note</Text>
          <Text style={styles.title}>Sélectionnez un objet :</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            labelField="label"
            valueField="value"
            data={dropdownData}
            placeholder="Choisir un objet"
            value={selectedobjValue}
            onChange={(item) => {
              setSelectedValue(item.value);
            }}
          />
          {selectedobjValue !== "temperature_sensor" &&
          selectedobjValue !== null ? (
            <ToggleButtons />
          ) : null}
          {selectedobjValue === "temperature_sensor" ? (
            <TextInput
              style={styles.input}
              onChangeText={(text) => setTemp(parseInt(text))}
              placeholder="Température"
              keyboardType="numeric"
              maxLength={5}
            />
          ) : null}

          <Text style={styles.title}>Sélectionnez une date :</Text>
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />

          {invalidbool && <Text style={styles.errorText}>{errormsg}</Text>}
          <Pressable style={styles.addButton} onPress={AjouterNote}>
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  container: {
    flex: 3,
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
  autoList: {
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

    justifyContent: "space-between",
    borderColor: "#ddd",
    borderWidth: 1,
    marginVertical: 10,
  },
  itemContent: {
    alignItems: "center",
    marginBottom: 10,
  },
  itemIcon: {
    marginRight: 10,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  itemName: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  timeBox: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  timeText: {
    fontSize: 14,
    color: "#555",
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
  addAutoButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#4caf50",
    width: "auto",
    alignSelf: "flex-end",
    borderRadius: 10,
    shadowColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  selectedValueText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
});

const stylesbtn = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  buttonSelected: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  buttonUnselected: {
    backgroundColor: "white",
    borderColor: "#ddd",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textSelected: {
    color: "white",
  },
  textUnselected: {
    color: "#333",
  },
});
