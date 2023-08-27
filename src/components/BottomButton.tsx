import React from "react"
import { View, Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native"
import { ColorsEncr } from "../assets/styles"
import tw from 'twrnc'

interface BottomButton {
    navigation: any,
    route?: string,
    params?: any,
    containerStyle?: StyleProp<ViewStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
    title: string,
    titleStyle?: StyleProp<TextStyle>,
    reverse?: boolean,
    disable?: boolean
}

const BottomButton: React.FC<BottomButton> = ({ navigation, route, params, containerStyle, buttonStyle, title, titleStyle, reverse, disable }) => {

    const onPress = () => {
        if(route) {
            navigation.navigate(route, {...params});
        }
    }

    return (
        <View style={[ tw`justify-center px-4 border-t border-gray-300`, {height: 60}, containerStyle ]}>
            <Pressable
                disabled={disable}
                onPress={onPress}
                style={[ tw`justify-center items-center border rounded px-5`, {backgroundColor: reverse ? '#FFFFFF' : ColorsEncr.main, height: 45, borderColor: ColorsEncr.main}, buttonStyle ]}
            >
                <Text style={[ tw`uppercase text-center font-medium`, {color: reverse ? ColorsEncr.main : 'black'}, titleStyle ]}>{ title }</Text>
            </Pressable>
        </View>
    )
}

export default BottomButton;