import { View, StyleSheet, Text } from "react-native"
import { Icon } from "@rneui/base"
import { ColorsEncr } from "../assets/styles"
import { RNPModal } from "./RNPModal"
import { Button } from "react-native-paper"
import tw from 'twrnc'
import { CommonActions, useNavigation } from "@react-navigation/native"
import React from "react"

export const CourseTimingOut: React.FC<{ visible: boolean, goBack?: boolean }> = ({ visible, goBack }) => {
    const navigation = useNavigation()

    const onHandleNavigation = () => {
        if(goBack) {
            navigation.goBack()
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Drawer',
                            params: {}
                        }
                    ]
                })
            )
        }
    }

    return (
        <RNPModal showModal={visible}>
            <View style={[ tw`justify-center items-center`, StyleSheet.absoluteFill, {backgroundColor: 'rgba(0, 0, 0, 0.5)'} ]}>
                <View style={[ tw`bg-white justify-center items-center rounded-2xl p-3`, {height: 300, width: 300} ]}>
                    <Icon type='material-community' name='car-clock' size={50} color={ColorsEncr.main} containerStyle={tw`mb-5`} />
                    <Text style={tw`text-lg text-black`}>Délai d'attente expiré.</Text>
                    <Text style={tw`text-gray-600 text-center text-base`}>Pour des raisons de performance, votre course a été annulé.</Text>

                    <Button onPress={onHandleNavigation} style={tw`mt-5`}>Quitter</Button>
                </View>
            </View>
        </RNPModal>
    )
}