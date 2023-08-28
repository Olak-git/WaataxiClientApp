import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { polices } from '../data/data';

export const HeaderTitle: React.FC<{headerTitle?: string}> = ({ headerTitle }) => {
    return (
        <Text style={[ tw`px-4 text-lg text-black`, {fontFamily: Platform.OS == 'android' ? 'IbarraRealNova-VariableFont_wght' : 'PatrickHand-Regular'}, {fontFamily: polices.times_new_roman} ]}>{ headerTitle }</Text>
    )
}

interface HeaderProps {
    navigation: any,
    headerTitle?: string,
    contentLeft?: React.ReactElement,
    content?: React.ReactElement
}
const Header: React.FC<HeaderProps> = ({navigation, headerTitle, contentLeft, content}) => {
    return (
        <View style={[ tw`flex-row items-center px-4`, {height: 60} ]}>
            {contentLeft
            ?
                contentLeft
            :
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon 
                        type='ant-design'
                        name='arrowleft'
                        size={30} />
                </Pressable>   
            }
            {content
            ?
                content
            :
                <HeaderTitle headerTitle={headerTitle} />
            }
        </View>
    )
}

export default Header;