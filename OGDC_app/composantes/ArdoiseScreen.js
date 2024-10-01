import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { obtenirObjets, obtenirUser } from '../utils';
import stylesCommuns from '../styles';
import { AntDesign } from '@expo/vector-icons';

export default function ArdoiseScreen({ navigation, route }) {
  const [objetsList, setObjetsList] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);  // State for refreshing
  const usrId = route.params.currentuser.Id;
  const [currentuser, setCurrentUser] = useState(null);

  const iconMap = {
    button: "poweroff",
    red_led: "bulb1",
    blue_led: "bulb1",
    green_led: "bulb1",
    movement_sensor: "eyeo",
    temperature_sensor: "enviromento",
  };

  const fetchUser = () => {
    if (usrId) {
      obtenirUser(usrId).then((user) => {
        setCurrentUser(user);
      }).catch(err => {
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
      const robotName = currentuser.idRobot != null ? `Robot ID: ${currentuser.idRobot}` : "No robot assigned";
      navigation.setOptions({ title: robotName });
    }
  }, [currentuser, navigation]);

  const fetchObjects = () => {
    if (currentuser && currentuser.idRobot != null) {
      obtenirObjets(currentuser.idRobot).then(items => {
        const transformedObjets = Object.entries(items.listeObjets).map(([key, value]) => ({
          name: key,
          status: value.status
        }));
        setObjetsList(transformedObjets);
        setError(null);
      }).catch(() => {
        setObjetsList([]);
        setError("Ce robot ne semble pas avoir d'objet...");
      });
    } else {
      setError("Vous n'avez pas de robot!");
    }
  };

  useEffect(() => {
    fetchObjects();
    const intervalId = setInterval(fetchObjects, 5000);
    return () => clearInterval(intervalId);
  }, [route, usrId, currentuser]);

  // J'ai trouver ça en fouillant en ligne. sert pas a grand chose mais c'est cool (:
  const onRefresh = () => {
    setRefreshing(true);
    fetchObjects();
    setRefreshing(false);
  };

  const handleItemPress = (item) => {
    Alert.alert("Work in Progress", `Le controle de ${item.name} n'est pas encore implémenté.`);
  };

  const renderItem = ({ item }) => {
    const isTemperatureSensor = item.name === 'temperature_sensor';
    const status = isTemperatureSensor
      ? `Temp: ${item.status[0]}°C, Humidity: ${item.status[1]}%`
      : `Status: ${item.status}`;
    const icon = iconMap[item.name] || "question";

    return (
      <Pressable style={styles.item} onPress={() => handleItemPress(item)}>
        <View style={styles.itemContent}>
          <AntDesign name={icon} size={30} color="black" style={styles.icon} />
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStatus}>{status}</Text>
          </View>
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
        <FlatList
          data={objetsList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: '#98de9c',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  itemStatus: {
    fontSize: 14,
    color: 'gray',
  },
  icon: {
    marginRight: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});
