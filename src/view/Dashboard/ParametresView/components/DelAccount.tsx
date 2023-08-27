import { View, Text, Modal, Pressable, TouchableOpacity, StatusBar, Platform } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import tw from 'twrnc'

interface DelAccountProps {
    visible: boolean,
    setVisible: any,
    onDelete: () => void
}
const DelAccount: React.FC<DelAccountProps> = ({visible, setVisible, onDelete}) => {
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
                    <View style={tw``}>
                        <Text style={[ tw`text-center px-10 text-gray-700 font-normal text-sm mb-5` ]}>Souhaitez-vous supprimer votre compte ?</Text>
                        <Text style={[tw`text-black mb-5`, {textAlign: 'center'}]}>La suppression de votre compte entraînera la suppression de vos données. Aucun autre compte ne pourra se créer avec vos références.</Text>
                        
                        <View style={[ tw`flex-row justify-between items-center`, {} ]}>

                            <TouchableOpacity
                                onPress={onDelete}
                                style={[tw`rounded border py-2 px-3 border-red-600`, {width: 100}]}
                            >
                                <Text style={tw`text-red-600 text-center`}>Oui</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                                style={[tw`rounded border border-blue-600 py-2 px-3`, {width: 100}]}
                            >
                                <Text style={tw`text-black text-center`}>Annuler</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DelAccount