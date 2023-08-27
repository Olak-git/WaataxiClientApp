import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import AddressPickup from '../../../components/AddressPickup';
import FlashMessage from '../../../components/FlashMessage';
import Header from '../../../components/Header';
import { Accueil, Destination } from '../../../assets';
import { toast, windowWidth } from '../../../functions/functions';
import { event } from 'react-native-reanimated';

interface FoundLocationViewProps {
    navigation: any,
    route: any
}
const FoundLocationView: React.FC<FoundLocationViewProps> = ({ navigation, route = () => {} }) => {

    const { placeholderText, event, bn } = route.params;

    const [coords, setCoords] = useState({});

    const onFetch = (data: any) => {
        setCoords(prevState => ({
            ...prevState, 
            address: data.addr,
            latitude: data.lat,
            longitude: data.lng
        }));
    }

    const checkValid = () => {
        if(Object.keys(coords).length === 0) {
            toast('DANGER', 'Please enter the Location.');
            return false
        }
        return true;
    }
    // console.log('Coords ===> ', coords);

    const callEvent = (event: string, data: any) => {
        DeviceEventEmitter.emit(event, data);
    }

    const onDone = () => {
        const isValid = checkValid()
        if(isValid) {
            callEvent(event, {[bn]: coords});
            navigation.goBack()
        }
    }

    useEffect(() => {
        return () => {
            DeviceEventEmitter.removeAllListeners("event.fetch")
        };
    }, []);

    return (
        <Base>
            <Header navigation={navigation} headerTitle='' />
            <View style={[ tw`flex-1 mt-1 px-3` ]}>

                <AddressPickup 
                    placeholderText={ placeholderText }
                    fetchAddress={onFetch}
                    label />

                <View style={[ tw`mb-3` ]} />
                
                <View style={[ tw`mt-3` ]}>
                    <TouchableOpacity
                        onPress={onDone}
                        style={[ tw`p-2 rounded border border-slate-200`, {}]}>
                        <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>Valider</Text>
                    </TouchableOpacity>
                </View>

            </View>
            
            <View style={[tw`justify-end  pb-3`, StyleSheet.absoluteFill, {zIndex: -1}]}>
                {/* <Accueil width='100%' opacity={0.5} /> */}
                <Destination width='100%' height={200} opacity={0.2} />
            </View>

        </Base>
    )
}

export default FoundLocationView;