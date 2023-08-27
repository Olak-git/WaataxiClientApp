import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { ColorsEncr } from '../../assets/styles';
import tw from 'twrnc';
import { Icon } from '@rneui/base';

interface DrawerMenuProps {
    navigation?: any,
    containerStyle?: StyleProp<ViewStyle>,
    iconType?: string,
    iconName: string,
    iconSize?: number,
    textMenu: string,
    screenName?: string,
    screenParams?: any,
    disabled?: boolean
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({ navigation, containerStyle, iconType = 'font-awesome-5', iconName, iconSize = 25, textMenu, screenName, screenParams={}, disabled }) => {

    return (
        <TouchableOpacity
            onPress={() => navigation?.navigate(screenName, screenParams)}
            disabled={disabled}
            style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50`, containerStyle ]}>
            <Icon 
                type={iconType}
                name={iconName}
                size={iconSize}
                color={ ColorsEncr.main } />
            <Text style={[ tw`px-4 text-xl ${disabled ? 'text-gray-300' : 'text-gray-500 text-black'} text-base`, {fontFamily: 'YanoneKaffeesatz-Medium'} ]}>{ textMenu }</Text>
        </TouchableOpacity>
    )
}

export default DrawerMenu;