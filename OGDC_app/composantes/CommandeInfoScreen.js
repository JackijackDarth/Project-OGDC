import { View, Pressable, Text } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import ItemMenu from './ItemMenu';
import Tuilerie from './Tuilerie';

import { obtenirUneCommandeJSON } from '../utils';
import stylesCommuns from '../styles';

export default function CommandeInfoScreen({ route }) {


    return (
        <View style={stylesCommuns.app}>
           <Text>Page en dévelopement!</Text>
        </View>
    );
}