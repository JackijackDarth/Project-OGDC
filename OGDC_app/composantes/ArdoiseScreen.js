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
import { useState, useEffect, act } from "react";
import {
  obtenirObjets,
  obtenirUser,
  UpdateObjet,
  lancerCommande,
} from "../utils";
import stylesCommuns from "../styles";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

///////////
//ARDOISE//
///////////
export function ArdoiseScreen({ navigation, route }) {
  const [objetsList, setObjetsList] = useState([]);
  const [ListobjComplet, setListobjComplet] = useState();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
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

  useEffect(() => {
    if (currentuser) {
      const robotName =
        currentuser.idRobot != null
          ? `Robot ID: ${currentuser.idRobot}`
          : "No robot assigned";
      navigation.setOptions({ title: robotName });
    }
  }, [currentuser, navigation]);

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
          console.log("Liste objets : ", transformedObjets);
          // console.log("Liste locations : ",transformedObjets.map(objet => objet.location))
          // setLocationList(transformedObjets.map(objet => objet.location));
          // setObjetsList(transformedObjets);
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
          console.table("Objets par emplacements : ", groupedByLocation);
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
    const intervalId = setInterval(fetchObjects, 300);
    return () => clearInterval(intervalId);
  }, [route, usrId, currentuser, navigation]);

  // J'ai trouver ça en fouillant en ligne. sert pas a grand chose mais c'est cool (:
  const onRefresh = () => {
    setRefreshing(true);
    fetchObjects();
    setRefreshing(false);
  };

  //Selection dun objet//
  const handleItemPress = (item) => {
    navigation.navigate("MenuObjet", {
      objet: item,
      ListobjComplet: ListobjComplet,
    });
  };

  const renderItem = ({ item }) => {
    const isTemperatureSensor = item.name === "temperature_sensor";
    const status = isTemperatureSensor
      ? `Temp: ${item.status[0]}°C, Humidity: ${item.status[1]}%`
      : `Status: ${item.status}`;
    const isLed =
      item.name == "red_led" ||
      item.name == "green_led" ||
      item.name == "blue_led";
    const ledIcon = item.status == 1 ? `toggle-on` : `toggle-off`;
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
          {item.name != "temperature_sensor" &&
          item.name != "camera" &&
          item.name != "movement_sensor" ? (
            <Pressable
              style={styles.objttgl}
              onPress={async () => {
                lancerCommande(
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

const handleItemPress = (item) => {
  console.log(item);
  navigation.navigate("MenuObjet", {
    objet: item,
    ListobjComplet: ListobjComplet,
  });
};

// const renderItem = ({ item }) => {
//   const isTemperatureSensor = item.name === 'temperature_sensor';
//   const status = isTemperatureSensor
//     ? `Temp: ${item.status[0]}°C, Humidity: ${item.status[1]}%`
//     : `Status: ${item.status}`;
//   const icon = iconMap[item.name] || "question";

//   return (
//     <Pressable style={styles.item} onPress={() => handleItemPress(item)}>
//       <View style={styles.itemContent}>
//         <AntDesign name={icon} size={30} color="black" style={styles.icon} />
//         <View>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemStatus}>{status}</Text>
//           <Text>{item.location}</Text>
//         </View>
//       </View>
//     </Pressable>
//   );
// };

// return (
//   <SafeAreaView style={[stylesCommuns.app, styles.container]}>
//     {error ? (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     ) : (
//       <FlatList
//         data={objetsList}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No objects available.</Text>
//           </View>
//         }
//       />
//     )}
//       <SectionList
//       sections={locationlist}
//       keyExtractor={(item, index) => item + index}
//       renderItem={({item}) => (
//         <View style={styles.item}>
//           <Text style={styles.title}>{item}</Text>
//         </View>
//       )}
//       renderSectionHeader={({section: {title}}) => (
//         <Text style={styles.header}>{title}</Text>
//       )}
//     />

////////////////////
//MenuObjectScreen//
///////////////////

export function MenuObjetScreen({ route, navigation }) {
  const [NomPièce, setRoomName] = useState(null);
  const [errormsg, setErrorMsg] = useState(null);
  const [invalidbool, setInvalidbool] = useState(false);
  const { objet, ListobjComplet } = route.params;
  const [selectedId, setSelectedId] = useState();
  const isTemperatureSensor = objet.name == "temperature_sensor";
  const choixlocation = [
    "Chambre",
    "Cuisine",
    "Chambre d'amis",
    "Sous-sol",
    "Sale de jeux",
  ];

  function EditObjet() {
    newlist = ListobjComplet.listeObjets[objet.name].location = NomPièce;
    UpdateObjet(ListobjComplet)
      .then((res) => {
        console.log("Assignation de pièce réussi %s", res);
        navigation.navigate("Ardoise");
      })
      .catch((err) => {
        console.log("Location change error: %s", err.msg);
        setInvalidbool(true);
      });
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor }]}
    >
      <Text style={[styles.title, { color: textColor }]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item === NomPièce ? "#6e3b6e" : "#f9c2ff";
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
      {isTemperatureSensor ? (
          <View>
          <Text style={styles.subtitle}>
            Entrez l'emplacement désiré de l'objet
          </Text>
          <TextInput
            style={styles.input}
            backgroundColor={invalidbool ? "rgba(255, 0, 0, 0.4)" : null}
            placeholder="Nom de la pièce"
            defaultValue={objet.value}
          />
         </View>
      ) : null}
      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Entrez l'emplacement désiré de l'objet
        </Text>
        <View style={styles.formContainer}>
          <FlatList
            data={choixlocation}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            extraData={NomPièce}
          />
          <TextInput
            style={styles.input}
            backgroundColor={invalidbool ? "rgba(255, 0, 0, 0.4)" : null}
            placeholder="Nom de la pièce"
            onChangeText={setRoomName}
            defaultValue={objet.location}
            value={NomPièce}
          />
        </View>
        <Text style={styles.msgerreur}>{errormsg}</Text>
        <Pressable onPress={EditObjet} style={styles.button}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  icon: {
    marginRight: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
  formBox: {
    backgroundColor: "#f1f7fe",
    overflow:"scroll",
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
    gap: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  formContainer: {
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 0,
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
    justifyContent: "flex-start",
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
  objttgl: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: "auto",
  },
});
