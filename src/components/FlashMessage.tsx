import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StatusBar, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import { windowHeight, windowWidth } from '../functions/functions';

interface FlashMessageProps {
    containerStyle?: StyleProp<ViewStyle>,
    title?: string,
    titleStyle?: StyleProp<TextStyle>,
    type?: null|string,
    text: string,
    textStyle?: StyleProp<TextStyle>,
    animated?: boolean,
    bottom?: boolean,
    // Temps d'animation avant apparition du message
    animationDuration?: number,
    // Temps d'animation avant disparition du message
    duration?: number,
    autoHide?: boolean,
    hideStatusBar?: boolean,
    visible?: boolean,
    onHide: any,
    buttonHide?: boolean
}

const FlashMessage: React.FC<FlashMessageProps> = ({
    containerStyle,
    title,
    titleStyle,
    type,
    text = '',
    textStyle,
    animated = true, 
    bottom = false, 
    animationDuration = 500, 
    duration = 5000, 
    autoHide = true, 
    hideStatusBar = false, 
    visible = false, 
    onHide = () => {} ,
    buttonHide = false
}) => {

    const translateAnim = useRef(new Animated.Value(0)).current;

    const typeNotification = type?.toLowerCase();
    
    const getNotification = () => {
        Animated.timing(
            translateAnim, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true
            }
        ).start();        
    }

    const hideNotification = async () => {
        await Animated.timing(
            translateAnim, {
                toValue: bottom ? windowHeight : -windowHeight,
                duration: animationDuration,
                useNativeDriver: true
            }
        ).start();
        setTimeout(onHide, 500);
    }

    useEffect(() => {
        if(visible) {
            getNotification();
            if(autoHide) {
                setTimeout(hideNotification, duration);
            }
        } else {
            if(autoHide) {
                setTimeout(hideNotification, duration);
            }
        }
    }, [visible])

    return (
        <>
            {visible && (
                <Animated.View style={[ tw`absolute ${bottom ? 'bottom-3' : 'top-3'} justify-center px-3`, {width: windowWidth, minHeight: 40, zIndex: 5, paddingTop: Platform.OS == 'android' ? (bottom ? 0 : StatusBar.currentHeight) : 0, transform: [{translateY: translateAnim}]} ]}>
                    <View style={[ tw`items-start justify-between flex-row bg-slate-900 rounded-lg p-4`, {height: '100%'}, containerStyle ]}>
                        <View style={[ tw`flex-1 flex-row` ]}>

                            {typeNotification && (
                                <Icon
                                    type={typeNotification == 'warning' 
                                            ? 'ionicon' 
                                            : (typeNotification == 'info' 
                                                ? 'antdesign' 
                                                : 'material-icon'
                                            )
                                        }
                                    name={typeNotification == 'warning' 
                                            ? 'warning' 
                                            : (typeNotification == 'info' 
                                                ? 'infocirlce' 
                                                : 'error'
                                            )
                                        }
                                    size={25}
                                    color={typeNotification == 'warning' 
                                                ? 'rgb(250, 204, 21)' 
                                                : (typeNotification == 'info' 
                                                    ? ColorsEncr.main_sm 
                                                    : 'rgb(220, 38, 38)'
                                                )
                                            }
                                    containerStyle={[ tw`mr-2` ]}
                                />
                            )}
                            <View style={tw`flex-1`}>
                                {title && (
                                    <Text style={[tw``, titleStyle]}>{title}</Text>
                                )}
                                <Text style={[ tw`text-sm text-white`, textStyle ]}>{text}</Text>
                            </View>

                        </View>

                        {buttonHide && (
                            <Pressable
                                onPress={() => {
                                    hideNotification();
                                }}
                                style={[ tw`ml-3 px-2` ]}>
                                <Icon
                                    type="antdesign"
                                    name="closecircle"
                                    size={25}
                                    color="white" />
                            </Pressable>
                        )}
                    </View>
                </Animated.View>
            )}
        </>
    )
}

export default FlashMessage;