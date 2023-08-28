import { Icon } from '@rneui/base';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ColorsEncr } from '../../../../assets/styles';
import tw from 'twrnc';
import { polices } from '../../../../data/data';

interface ButtonMenuProps {
    navigation: any,
    route: string,
    iconName: string,
    caption: string
}
const ButtonMenu: React.FC<ButtonMenuProps> = ({ navigation, route, iconName, caption }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(route)}
            style={[ tw`flex-1 justify-center items-center bg-orange-100 py-5 px-3`, {height: '100%'} ]}>
            <View style={[ tw`` ]}>
                <Icon
                    type='font-awesome-5'
                    name={iconName}
                    color={ColorsEncr.main}
                    size={60} />
                <Text style={[ tw`text-center text-black`, {fontFamily: polices.times_new_roman} ]}>{ caption }</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ButtonMenu;