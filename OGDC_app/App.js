import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { AuthenScreen, SeConnecterScreen, AideScreen, CreeCompteScreen } from './composantes/Authen';
import ArdoiseScreen from './composantes/ArdoiseScreen';
import PanierScreen from './composantes/PanierScreen';
import CommandeScreen from './composantes/CommandeScreen';
import CommandeInfoScreen from './composantes/CommandeInfoScreen';
import RestoInfoScreen from './composantes/RestoInfoScreen';
import { AccueilScreen, AjoutRobotScreen } from './composantes/AccueilScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const { Navigator, Screen, Group } = createNativeStackNavigator();

// Create the Bottom Tab Navigator component
function MainTabNavigator({ route }) {
  const currentuser = route.params.currentuser; // Access usrId from the route
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Accueil"
        component={AccueilScreen}
        options={{ title: "OGDC" }}
        initialParams={{ currentuser }} // Pass usrId to AccueilScreen
      />
      <Tab.Screen
        name="Ardoise"
        component={ArdoiseScreen}
        options={{ title: "Page lambda 1" }}
        initialParams={{ currentuser }} // Pass usrId to ArdoiseScreen
      />
      <Tab.Screen
        name="CommandeInfo"
        component={CommandeInfoScreen}
        options={{ title: "Page lambda 2" }}
        initialParams={{ currentuser }} // Pass usrId to CommandeInfoScreen if needed
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Navigator initialRouteName="Authen" screenOptions={{ headerTitleAlign: "center" }}>

        {/* Wrap the Tab Navigator within a Screen component */}
        <Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />

        <Screen name="Aide" component={AideScreen} />

        <Screen name="Authen" component={AuthenScreen}
          options={{ title: "Sign up", headerShown: false }} />

        <Screen name="SeConnecter" component={SeConnecterScreen}
          options={{ title: "", headerTransparent: true, headerBackTitle: "Back" }} />

        <Group screenOptions={{ presentation: 'modal' }}>
          <Screen name="CreeCompte" component={CreeCompteScreen} options={{ title: "S'inscrire" }} />
        </Group>

        <Group screenOptions={{ presentation: 'modal' }}>
          <Screen name="AjoutRobot" component={AjoutRobotScreen} options={{ title: "Ajouter un robot" }} />
        </Group>

        <Screen name="Panier" component={PanierScreen} />

        <Screen name="Commandes" component={CommandeScreen} />

        

        <Screen name="RestoInfo" component={RestoInfoScreen}
          options={{ title: "Nous joindre" }} />
      </Navigator>
    </NavigationContainer>
  );
}
