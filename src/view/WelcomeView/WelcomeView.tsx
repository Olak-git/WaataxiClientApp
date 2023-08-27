import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { ColorsEncr } from '../../assets/styles';
import { windowWidth, windowHeight } from '../../functions/functions';
// @ts-ignore
import RadialGradient from 'react-native-radial-gradient';
import { setWelcome } from '../../feature/init.slice';
import { Accueil, Accueil1, Accueil2 } from '../../assets';

interface WelcomeViewProps {
   navigation: any,
   route: any 
}

const WelcomeView: React.FC<WelcomeViewProps> = (props) => {

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);
    
    const {welcome: hasGreet} = init;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const bgTop = ColorsEncr.main;
    const bgBottom = '#FFFFFF';

    const dispatchNavigation = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Presentation'}
                ]
            })
        )
    }

    const onHandle = async () => {
        await dispatch(setWelcome(true))
    }

    useEffect(() => {
        Animated.timing(
            fadeAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();
        if(hasGreet) {
            dispatchNavigation();
        } else {
            setTimeout(() => {
                onHandle();
            }, 3000);
        }
    }, [hasGreet])

    return (
        <View style={[ tw`flex-1 relative` ]}>
            <StatusBar backgroundColor={bgTop} />
            <View style={[ tw`absolute flex-row top-0 left-0`, {width: windowWidth, height: windowHeight} ]}>
                <View style={[ tw`flex-1`, {backgroundColor: bgBottom} ]}></View>
                <View style={[ tw`flex-1`, {backgroundColor: bgTop} ]}></View>
            </View>
            <View style={[ tw`flex-1 justify-center items-center`, {borderBottomLeftRadius: 70, backgroundColor: bgTop} ]}>
                <View style={[ tw`rounded-full overflow-hidden`, {width:200,height:200}]}>
                    <RadialGradient 
                        style={[tw`justify-center items-center`, {width:'100%',height:'100%'}]}
                            colors={['#ffffff','#ffffff',ColorsEncr.main]}
                            stops={[0.005,0.009,0.4]}
                            center={[100,100]}
                            radius={200}>
                        <Image source={require('../../assets/images/icone-waa-1.jpg')} style={[ tw`rounded-2xl`, {width: 110, height: 110} ]} />
                    </RadialGradient>
                </View>
            </View>
            <View style={[ tw`flex-1`, {borderTopRightRadius: 70, backgroundColor: bgBottom} ]}>
                <Animated.View
                    style={[tw`mt-10 flex-1 justify-end items-center pb-10`, { opacity: fadeAnim }]}>
                    <View style={[ tw`` ]}>
                        <Accueil2 width={windowWidth} height={200} />
                    </View>
                </Animated.View>
            </View>
        </View>
    )
}

export default WelcomeView;