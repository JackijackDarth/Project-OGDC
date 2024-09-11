import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import * as Location from "expo-location";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import stylesCommuns from '../styles';

const RegionMontreal = {
    latitude: 45.57959635115827,
    latitudeDelta: 0.2898489739060395,
    longitude: -73.80305992439389,
    longitudeDelta: 0.24999964982271194,
};

const resto_homer = { latitude: 45.65609, longitude: -73.77086 };

export default function RestoInfoScreen({ navigation, route }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('vous avez refuser la demande de localisation');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    let text = 'attente..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={stylesCommuns.app}>
            <View style={styles.sectionHaut}>
                <Text style={styles.bienvenue}>Votre café préféré: Café Homer</Text>
                <Text>Coordonnées: {resto_homer.latitude}, {resto_homer.longitude}</Text>
            </View>
            <View style={styles.sectionBas}>
                <MapView style={styles.carte} initialRegion={RegionMontreal}>
                    <Marker coordinate={resto_homer} pinColor="red">
                        <Callout>
                            <Text>Café Homer</Text>
                        </Callout>
                    </Marker>
                    <Circle
                        center={resto_homer}
                        radius={100}
                        strokeColor="red"
                        fillColor="rgba(255,0,0,0.3)"
                    />
                    {location && (
                        <>
                            <Marker coordinate={location} pinColor="green">
                                <Callout>
                                    <Text>Votre position</Text>
                                </Callout>
                            </Marker>
                            <Circle
                                center={location}
                                radius={100}
                                strokeColor="green"
                                fillColor="rgba(0,255,0,0.3)"
                            />
                        </>
                    )}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHaut: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "blue"
    },
    sectionBas: {
        flex: 3,
    },
    carte: {
        width: "100%",
        height: "100%"
    },
    marqueur: {
        fontSize: 22,
    },
    bienvenue: {
        fontSize: 22,
    },
});
