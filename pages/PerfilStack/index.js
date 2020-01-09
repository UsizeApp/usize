
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import Tab1Email from './Tab1Email';
import Tab2Persona from './Tab2Persona';
import Tab3Gestion from './Tab3Gestion';

import P1NuevaPersona from './P1NuevaPersona';

const TabScreen = createMaterialTopTabNavigator(
  {
    Tab1Email: { screen: Tab1Email },
    Tab2Persona: { screen: Tab2Persona },
    Tab3Gestion: { screen: Tab3Gestion },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#66CBFF',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: '#633689',
      },
      labelStyle: {
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#87B56A',
        borderBottomWidth: 2,
      },
    },
  }
);

export default createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      title: 'Perfil',
      headerStyle: {
        backgroundColor: '#66CBFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'white',
    }
  },
  P1NuevaPersona: P1NuevaPersona,
});
