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
  TouchableOpacity,
  SectionList,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import {
  obtenirObjets,
  obtenirUser,
  UpdateObjet,
  lancerCommande,
} from "../utils";
import stylesCommuns from "../styles";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

///////////
// ARDOISE //
///////////
export function ArdoiseScreen({ navigation, route }) {
  const [objetsList, setObjetsList] = useState([]);
  const [ListobjComplet, setListobjComplet] = useState();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const usrId = route.params.currentuser.Id;
  const [currentuser, setCurrentUser] = useState(null);
  const [locationlist, setLocationList] = useState([]);

  const iconMap = {
    camera: "camera",
    button: "poweroff",
    red_led: "bulb1",
    blue_led: "bulb1",
    green_led: "bulb1",
    movement_sensor: "eyeo",
    temperature_sensor: "enviromento",
  };

  // Fetch user data based on user ID
  const fetchUser = () => {
    if (usrId) {
      obtenirUser(usrId)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  };

  useEffect(() => {
    fetchUser();
    const intervalId = setInterval(fetchUser, 10000);
    return () => clearInterval(intervalId);
  }, [route, usrId]);

  // Set navigation title based on robot ID
  useEffect(() => {
    if (currentuser) {
      const robotName =
        currentuser.idRobot != null
          ? `Robot ID: ${currentuser.idRobot}`
          : "No robot assigned";
      navigation.setOptions({ title: robotName });
    }
  }, [currentuser, navigation]);

  // Fetch objects for the current robot
  const fetchObjects = () => {
    if (currentuser && currentuser.idRobot != null) {
      obtenirObjets(currentuser.idRobot)
        .then((items) => {
          setListobjComplet(items);
          const transformedObjets = Object.entries(items.listeObjets).map(
            ([key, value]) => ({
              name: key,
              status: value.status,
              location: value.location,
              pin: value.pin,
            })
          );

          const groupedByLocation = transformedObjets.reduce(
            (sections, item) => {
              const section = sections.find((s) => s.title === item.location);
              if (section) {
                section.data.push(item);
              } else {
                sections.push({ title: item.location, data: [item] });
              }
              return sections;
            },
            []
          );

          setObjetsList(groupedByLocation);
          setError(null);
        })
        .catch(() => {
          setObjetsList([]);
          setError("Ce robot ne semble pas avoir d'objet...");
        });
    } else {
      setError("Vous n'avez pas de robot!");
    }
  };

  useEffect(() => {
    fetchObjects();
    const intervalId = setInterval(fetchObjects, 30000);
    return () => clearInterval(intervalId);
  }, [route, usrId, currentuser, navigation]);

  // Refresh objects
  const onRefresh = () => {
    setRefreshing(true);
    fetchObjects();
    setRefreshing(false);
  };

  // Handle item selection
  const handleItemPress = (item) => {
    navigation.navigate("MenuObjet", {
      objet: item,
      ListobjComplet: ListobjComplet,
    });
  };

  // Render each object item
  const renderItem = ({ item }) => {
    const isTemperatureSensor = item.name === "temperature_sensor";
    const status = isTemperatureSensor
      ? `Temp: ${item.status[0]}°C, Humidity: ${item.status[1]}%`
      : `Status: ${item.status}`;
    const isLed =
      item.name == "red_led" ||
      item.name == "green_led" ||
      item.name == "blue_led";
    const ledIcon = item.status == 1 ? "toggle-on" : "toggle-off";
    const isButton = item.name == "button";
    const buttonIcon = "bullseye";
    const icon = iconMap[item.name] || "question";

    return (
      <Pressable style={styles.item} onPress={() => handleItemPress(item)}>
        <View style={styles.itemContent}>
          <AntDesign name={icon} size={30} color="black" style={styles.icon} />
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStatus}>{status}</Text>
          </View>
          {item.name !== "temperature_sensor" &&
          item.name !== "camera" &&
          item.name !== "movement_sensor" ? (
            <Pressable
              style={styles.objttgl}
              onPress={async () => {
                await lancerCommande(
                  isLed ? "switchLed" : isButton ? "pressButton" : "erreur",
                  {
                    name: item.name,
                    pin: item.pin,
                    value: item.status == 1 ? 0 : 1,
                  }
                )
                  .then((res) => {
                    console.log("commande Lancer %s", res);
                    fetchObjects();
                  })
                  .catch((err) => {
                    console.log("commande error: %s", err.msg);
                  });
                console.log(item);
              }}
            >
              <FontAwesome5
                name={isLed ? ledIcon : isButton ? buttonIcon : "question"}
                size={30}
                color="black"
              />
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[stylesCommuns.app, styles.container]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <SectionList
          sections={objetsList}
          keyExtractor={(item, index) => item.name + index}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No objects available.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

////////////////////
// MENU OBJECT SCREEN //
///////////////////

export function MenuObjetScreen({ route, navigation }) {
  const [NomPièce, setRoomName] = useState(null);
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const { objet, ListobjComplet } = route.params;
  const [temp, setTemp] = useState(null)
  const [selectedId, setSelectedId] = useState();
  const isTemperatureSensor = objet.name === "temperature_sensor";
  const choixlocation = [
    "Chambre",
    "Cuisine",
    "Chambre d'amis",
    "Sous-sol",
    "Sale de jeux",
  ];
   
  // Update object location
  function EditObjet() {
    ListobjComplet.listeObjets[objet.name].location = NomPièce != null ? NomPièce : objet.location;
    UpdateObjet(ListobjComplet)
      .then((res) => {
        console.log("Assignation de pièce réussi %s", res);
        navigation.navigate("Ardoise");
      })
      .catch((err) => {
        console.log("Location change error: %s", err.msg);
        setInvalidbool(true);
      });
      console.log(objet.name,objet.pin, temp)
      if (temp != null){
        lancerCommande(
        "changeTemp",
        {
          name: objet.name,
          pin: objet.pin,
          value:temp,
        }
      )
        .then((res) => {
          console.log("commande Lancer %s", res);
          fetchObjects();
        })
        .catch((err) => {
          console.log("commande error: %s", err.msg);
        });
      }
      
  }

  // Item component for FlatList
  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{item}</Text>
    </TouchableOpacity>
  );

  // Render each location item
  const renderItem = ({ item }) => {
    const backgroundColor = item === NomPièce ? "#7393B3" : "#C0C0C0";
    const color = item === NomPièce ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => setRoomName(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formBox}
      keyboardVerticalOffset={100}
      contentContainerStyle={styles.container}
    >
      {isTemperatureSensor && (
        <View>
          <Text style={styles.subtitle}>
            Entrez la température de l'objet
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setTemp(text)}
            placeholder="Température"
            keyboardType="numeric"
            maxLength={5}
          />
         
          {invalidbool && (
            <Text style={styles.errorText}>
              L'un des champs n'est pas valide
            </Text>
          )}
        </View>
      )}
      
      <Text style={styles.subtitle}>
          Entrez l'emplacement désiré de l'objet
        </Text>
       
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRoomName(text)}
            placeholder="Position"
            maxLength={5}
            defaultValue={objet.location}
            value={NomPièce}
          />
           <Text style={styles.subtitle}>Ou choisissez une pièce</Text>
      <FlatList
      style={styles.lctslct}
        data={choixlocation}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
              EditObjet();
              setErrorMsg(null);
              setInvalidbool(false);
          }}
        >
          <Text style={styles.buttonText}>Modifier la pièce</Text>
        </TouchableOpacity>
        {errormsg && (
          <Text style={styles.errorText}>{errormsg}</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 14,
    color: "#555",
  },
  icon: {
    marginRight: 15,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 10,
    backgroundColor: "#E4E0E1",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  formBox: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  objttgl:{
    marginLeft:"auto"
  }
});
