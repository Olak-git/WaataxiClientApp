import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleProp, useColorScheme, ViewStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import { statusBarHeight } from '../data/data';
import { Root, Dialog, Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';

interface BaseProps {
    backgroundColor?: string,
    hiddenStatusBar?: boolean,
    containerStyle?: StyleProp<ViewStyle>,
    navigation?: any
}
const Base: React.FC<BaseProps> = ({backgroundColor = null, hiddenStatusBar, containerStyle, navigation, ...props}) => {

    const isDarkMode = useColorScheme() === 'dark';

    const user = useSelector((state:any) => state.user.data);

    const backgroundStyle = {
    //   backgroundColor: Colors.white
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    };

    const goAuth = () => {
        if(navigation) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'Auth'}
                    ]
                })
            )   
        }
    }

    useEffect(() => {
        // console.log('User -> ', user)
        if(Object.keys(user).length == 0) {
            goAuth()
        }
    }, [user])
  
    return (
        // <Root theme='dark'>
        <SafeAreaView style={[ tw`flex-1`, {backgroundColor: backgroundColor ? backgroundColor : Colors.white, paddingTop: Platform.OS == 'android' ? statusBarHeight : 0}, containerStyle ]}>
            <StatusBar
                hidden={hiddenStatusBar}
                backgroundColor={ ColorsEncr.main_sm }
                translucent
            />
            { props.children }
        </SafeAreaView>
        // </Root>
    )
}

export default Base;