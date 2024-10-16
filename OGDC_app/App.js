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
import { AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
const { Navigator, Screen, Group } = createNativeStackNavigator();

 
function MainTabNavigator({ route }) {
  const currentuser = route.params.currentuser;  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Accueil') {
          iconName = focused
            ? 'robot' : 'robot-outline';
        }
        else if (route.name === 'Ardoise') {
          iconName = focused ? 'lightbulb-group' : 'lightbulb-group-outline';
        }
        else if (route.name === 'CommandeInfo') {
          iconName = focused ? 'cog' : 'cog-outline';
        }
        return  <MaterialCommunityIcons name={iconName} size={30} color="black"   />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
      <Tab.Screen
        name="Accueil"
        component={AccueilScreen}
        options={{ title: "OGDC"}}
        initialParams={{ currentuser }}  
      />
      <Tab.Screen
        name="Ardoise"
        component={ArdoiseScreen}
        options={{ title: "Page d'objet" }}
        initialParams={{ currentuser }}  
      />
      <Tab.Screen
        name="CommandeInfo"
        component={CommandeInfoScreen}
        options={{ title: "Settings" }}
        initialParams={{ currentuser }}  
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
          <Screen name="MenuObjet" component={AjoutRobotScreen} options={{ title: "Menu d'objet" }} />
        </Group>

        <Screen name="Panier" component={PanierScreen} />

        <Screen name="Commandes" component={CommandeScreen} />

        

        <Screen name="RestoInfo" component={RestoInfoScreen}
          options={{ title: "Nous joindre" }} />
      </Navigator>
    </NavigationContainer>
  );
}
