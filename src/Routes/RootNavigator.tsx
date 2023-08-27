import { View, Text } from 'react-native'
import React from 'react'
import MainStack from './MainStack';
import { NavigationContainer } from '@react-navigation/native';

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
}

export default RootNavigator