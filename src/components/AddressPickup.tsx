import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ColorsEncr } from '../assets/styles';
import { google_maps_apikey } from '../data/data';
import tw from 'twrnc';

interface AddressPickupProps {
    placeholderText?: string,
    fetchAddress: any,
    label?: boolean
}

const AddressPickup: React.FC<AddressPickupProps> = ({ placeholderText = 'Search', fetchAddress = () => {}, label }) => {
    const refGooglePlace = useRef(null)

    const onPressAddress = (data: any, details?: any) => {

        // console.log('Data => ', data);
        // console.log('Details => ', details);

        // const addr = details.formatted_address;
        const addr = data.description;
        const lat = details.geometry.location.lat;
        const lng = details.geometry.location.lng;
        fetchAddress({
            addr: addr,
            lat: lat, 
            lng: lng
        })
    }

    return (
        <>
            {label && (
                <Text style={tw`text-slate-600 font-semibold text-lg mb-2`}>{ placeholderText }</Text>
            )}
            <View style={[ tw`flex-row mb-3` ]}>
                <GooglePlacesAutocomplete
                    ref={refGooglePlace}
                    placeholder={ placeholderText }
                    minLength={2}
                    query={{
                        key: google_maps_apikey,
                        language: 'fr',
                    }}
                    fetchDetails={true}
                    onPress={onPressAddress}
                    onNotFound={() => console.log('')}
                    listEmptyComponent={() => (
                        <View>
                            {/* @ts-ignore */}
                            <Text style={tw`text-gray-600`}>0 adresse trouvée {refGooglePlace.current?.getAddressText() ? 'pour ' + refGooglePlace.current?.getAddressText() : ''}</Text>
                        </View>
                    )}
                    onFail={(error) => console.error(error)}
                    styles={{
                        ...styles,
                        container: {
                        }
                    }}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
        backgroundColor: 'red'
    },
    textInputContainer: {
    //   backgroundColor: 'rgb(71, 85, 105)',
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   height: 60,
    //   paddingHorizontal: 10
    },
    textInput: {
        height: 48,
        color: 'black', //'#5d5d5d',
        marginBottom: 0,
        backgroundColor: '#F3F3F3'
    },
    powered: {
        tintColor: ColorsEncr.main
    },
    description: {
        color: 'rgb(100, 116, 139)'
    },
    predefinedPlacesDescription: {
        color: 'red'
    }
})

export default AddressPickup;