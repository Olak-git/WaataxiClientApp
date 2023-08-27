import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React, { Children, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc';
import { windowWidth } from '../functions/functions';

interface HelpDialProps {
    popover: React.ReactElement,
}
const HelpDial: React.FC<HelpDialProps> = ({popover, children}) => {
    const [visible, setVisible] = useState(false);
    return (
        <View style={[ tw`relative flex-row`, {} ]}>
            {visible && (
                <View style={[tw`bg-orange-300 border absolute rounded`, {maxWidth: windowWidth/2, top: -30}]}>
                    {popover}
                        {/* <Text style={[tw`text-black text-xs flex-1`, {lineHeight: 13}]}>{description}</Text> */}
                    {/* <View style={[tw`flex-row justify-center border`]}>
                        <View style={[tw``, styles.triangle]}></View>
                    </View> */}
                </View>
            )}
            <Pressable onPress={() => setVisible(!visible)} style={[tw`border relative`]}>
                <View style={[tw`flex-row justify-center border absolute`, {top: -10, right: 0}]}>
                    <View style={[tw``, styles.triangle]}></View>
                </View>
                {children}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    triangle: {
        // width: 15,
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
        borderTopWidth: 13,
        borderTopColor: '#000000'
    }
})

export default HelpDial;