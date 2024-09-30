import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { obtenirObjets } from '../utils'; 
import stylesCommuns from '../styles';
import { AntDesign } from '@expo/vector-icons';

export default function ArdoiseScreen({ navigation, route }) {
  const [objetsList, setObjetsList] = useState([]);
  const [error, setError] = useState(null); // To handle errors
  const currentuser  = route.params.currentuser;
  const iconMap = {
    button: "poweroff",   
    red_led: "bulb1",     
    blue_led: "bulb1",
    green_led: "bulb1",
    movement_sensor: "eyeo",
    temperature_sensor: "enviromento",  
  };

  const fetchObjects = () => {
    obtenirObjets(currentuser.rbtId).then(items => {
      if (items && items.listeObjets) {
        const transformedObjets = Object.entries(items.listeObjets).map(([key, value]) => ({
          name: key,
          status: value.status
        }));
        setObjetsList(transformedObjets);
        setError(null); // Reset error on successful fetch
      } else {
        setObjetsList([]); // No objects found
        setError("No objects found for this robot.");
      }
    }).catch(() => {
      setObjetsList([]); // Clear list on error
      setError("Failed to fetch objects. Please try again later.");
    });
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchObjects(); // Initial fetch
    if (!error){
      const intervalId = setInterval(fetchObjects, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
   
  }, [currentuser.rbtId,route]); // Adding currentuser.rbtId to dependencies to refetch when it changes

  useEffect(() => {
    console.log("Object list:", objetsList);
  }, [objetsList]);

  const renderItem = ({ item }) => {
    const isTemperatureSensor = item.name === 'temperature_sensor';
    
    // Set status for temperature_sensor
    const status = isTemperatureSensor 
      ? `Temp: ${item.status[0]}°C, Humidity: ${item.status[1]}%` 
      : `Status: ${item.status}`;
  
    const icon = iconMap[item.name] || "question";
  
    return (
      <Pressable style={styles.item}>
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
