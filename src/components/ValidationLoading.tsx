import React from 'react';
import { ActivityIndicator, Linking, Modal, Text, View } from 'react-native';
import tw from 'twrnc';

interface ValidationLoadingProps {   
}
export const ValidationLoading: React.FC<ValidationLoadingProps> = () => {
    
    return (
        <></>        
        // <Modal 
        //     show={true}
        //     backgroundColor={'rgba(255,255,255,0.4)'}
        //     style={[ {} ]}>
        //     <View style={[ tw`px-3`, {flex: 1, justifyContent: 'center', alignItems: 'center'} ]}>
        //         <Text style={[ tw`mb-4 text-lg text-black` ]}>Votre compte est en cours de validation</Text>
        //         <ActivityIndicator
        //             size={'large'}
        //             color={'rgb(20,52,100)'}
        //             animating
        //             style={[ tw`mb-3` ]} />
        //         <Text style={[ tw`mb-3 text-base text-center` ]}>Une alerte vous sera envoyée par e-mail lorsque Amanou Tech validera votre compte. Pour plus d'informations, visitez notre site internet:</Text>
        //         <Text 
        //             onPress={() => Linking.openURL('https://amanou.tech')}
        //             style={[ tw`text-blue-500` ]}
        //             >amanou.tech</Text>
        //     </View>
        // </Modal>
    )
}