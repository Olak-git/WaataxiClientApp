import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ColorsEncr } from '../../../../assets/styles';
import tw from 'twrnc';
import { Icon } from '@rneui/base';

interface DrawerMenuProps {
    navigation?: any,
    containerStyle?: any,
    iconType?: string,
    iconName: string,
    iconSize?: number,
    textMenu: string,
    screenName?: string,
    screenParams?: any
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({ navigation, containerStyle = [], iconType = 'font-awesome-5', iconName, iconSize = 25, textMenu, screenName, screenParams={} }) => {

    return (
        <TouchableOpacity
            onPress={() => navigation?.navigate(screenName, screenParams)}
            style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50`, ...containerStyle ]}>
            <Icon 
                type={iconType}
                name={iconName}
                size={iconSize}
                color={ ColorsEncr.main } />
            <Text style={[ tw`px-4 text-lg text-gray-500` ]}>{ textMenu }</Text>
        </TouchableOpacity>
    )
}

export default DrawerMenu;