import React from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import Base from './Base';
import { Icon } from '@rneui/base';

interface ActivityLoadingProps {
    loadingText?: string,
    navigation?: any,
    goBack?: boolean
}
export const ActivityLoading: React.FC<ActivityLoadingProps> = ({ loadingText, navigation, goBack }) => {
    
    return (
        <Base>
            <View style={[ tw`rounded-3xl flex-1 justify-center items-center bg-white` ]}>
                {(Platform.OS !== 'android' && goBack && navigation && navigation.canGoBack()) && (
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={[tw`absolute rounded top-1 left-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'}]}>
                        <Icon type='ant-design' name='arrowleft' size={20} />
                    </TouchableOpacity>
                )}
                {/* <ActivityIndicator
                    size={'large'}
                    color={'orange'}
                    animating /> */}
                <Spinner type='Pulse' color={ColorsEncr.main} size={60} />
                {loadingText && (
                    <Text style={[ tw`text-gray-400` ]}>{ loadingText }</Text>
                )}
            </View>
        </Base>
    )
}