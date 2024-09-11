import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { AuthenScreen, SeConnecterScreen, AideScreen } from './composantes/Authen';
import ArdoiseScreen from './composantes/ArdoiseScreen';
import PanierScreen from './composantes/PanierScreen';
import CommandeScreen from './composantes/CommandeScreen';
import CommandeInfoScreen from './composantes/CommandeInfoScreen';
import RestoInfoScreen from './composantes/RestoInfoScreen';
import AccueilScreen from './composantes/AccueilScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Navigator initialRouteName="Authen"
        screenOptions={{
          headerTitleAlign: "center",
        }} >
        <Screen name="Accueil" component={AccueilScreen}
          options={{
            title: "OGDC",
          }} />
        <Screen name="Aide" component={AideScreen} />
        <Screen name="Authen" component={AuthenScreen}
          options={{title:"main"}} />
        <Screen name="SeConnecter" component={SeConnecterScreen}
          options={{ title: "connection"}} />
        <Screen name="Ardoise" component={ArdoiseScreen} />
        <Screen name="Panier" component={PanierScreen} />
        <Screen name="Commandes" component={CommandeScreen} />
        <Screen name="CommandeInfo" component={CommandeInfoScreen}
          options={{ title: "Détail de la commande" }} />
        <Screen name="RestoInfo" component={RestoInfoScreen}
          options={{ title: "Nous joindre" }} />
      </Navigator>
    </NavigationContainer>
  );
}