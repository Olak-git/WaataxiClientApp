import { View, Text, Modal, Pressable, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import tw from 'twrnc'
import { polices } from '../../../../data/data'

interface SignoutProps {
    visible: boolean,
    setVisible: any,
    onSignout: () => void
}
const Signout: React.FC<SignoutProps> = ({visible, setVisible, onSignout}) => {

    return (
        <Modal visible={visible} transparent animationType='slide'>
        <View style={[ tw`flex-1 justify-center items-center`, {backgroundColor: 'rgba(0, 0, 0, 0.5)'} ]}>
            <Pressable
                onPress={() => setVisible(false)}
                // @ts-ignore
                style={[tw`absolute right-5`, {top: Platform.OS == 'android' ? StatusBar.currentHeight + 5 : 35}]}>
                <Icon type='ant-design' name='close' size={30} color='white' />
            </Pressable>
            <View style={[ tw`bg-white justify-center items-center rounded-2xl p-3`, {height: 300, width: 300} ]}>
                <View style={[tw``, {minWidth: '90%'}]}>
                    <Text style={[ tw`text-center px-10 text-gray-700 font-normal text-sm mb-5`, {fontFamily: polices.times_new_roman} ]}>Souhaitez-vous vous déconnecter ?</Text>
                    
                    <View style={[ tw`flex-row justify-between items-center`, {} ]}>

                        <TouchableOpacity
                            onPress={onSignout}
                            style={[tw`rounded border py-2 px-3`, {width: 100}]}
                        >
                            <Text style={[tw`text-black text-center`, {fontFamily: polices.times_new_roman}]}>Oui</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={[tw`rounded border py-2 px-3`, {width: 100}]}
                        >
                            <Text style={[tw`text-black text-center`, {fontFamily: polices.times_new_roman}]}>Annuler</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </View>
    </Modal>
    )
}

export default Signout