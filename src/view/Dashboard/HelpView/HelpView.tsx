import React, { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import TextareaForm from '../../../components/TextareaForm';
import { fetchUri, toast, windowHeight } from '../../../functions/functions';
import FlashMessage from '../../../components/FlashMessage';
import { useSelector } from 'react-redux';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { google_maps_apikey, polices, waataxi_infos } from '../../../data/data';
import { openCoordonateOnMap, openUrl } from '../../../functions/helperFunction';
import Geocoder from 'react-native-geocoding';

Geocoder.init(google_maps_apikey, {language : "fr"});

interface HelpViewProps {
    navigation: any
}
const HelpView: React.FC<HelpViewProps> = ({ navigation }) => {

    const user = useSelector((state: any) => state.user.data);

    const [showModal, setShowModal] = useState(false);

    const [geo, setGeo] = useState<any>('');

    const [inputs, setInputs] = useState({
        objet: '',
        message: ''
    });

    const [errors, setErrors] = useState({
        objet: null,
        message: null
    });

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onHandle = () => {
        let valide = true;
        if(!inputs.objet) {
            handleError('objet', 'est requis.');
            valide = false;
        } else if(!inputs.objet.trim()) {
            handleError('objet', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('objet', null);
        }

        if(!inputs.message) {
            handleError('message', 'est requis.');
            valide = false;
        } else if(!inputs.message.trim()) {
            handleError('message', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('message', null);
        }

        if(valide) {
            Keyboard.dismiss();
            setShowModal(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('account', 'passager');
            formData.append('help[objet]', inputs.objet);
            formData.append('help[message]', inputs.message);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // 'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(json => {
                setShowModal(false);
                if(json.success) {
                    toast('SUCCESS', 'Message envoyé.');
                    handleOnChange('objet', '');
                    handleOnChange('message', '');
                } else {
                    if(Platform.OS == 'android') {
                        
                    }
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                setShowModal(false);
                console.log('HelpView Error1: ', error)
            })
        }
    }

    const getCoordonates = async () => {
        await Geocoder.from(waataxi_infos.address)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('StartCoords: ', location);
            setGeo({lat: location.lat, lng: location.lng})
        })
        .catch(error => {
            console.warn('HelpView Error2: ', error)
        });
    }

    useEffect(() => {
        getCoordonates();
    }, [])
    
    return (
        <Base>
            <ModalValidationForm showModal={showModal} />
            <Header navigation={navigation} headerTitle='Aide' />
            <KeyboardAvoidingView behavior={Platform.OS == 'ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={[ tw`my-3` ]}>
                        <View style={tw`mb-4`}>
                            <Text style={[ tw`text-center font-semibold text-gray-500 text-lg mb-3`, {fontFamily: polices.times_new_roman} ]}>En quoi pouvons-nous vous aider ?</Text>
                            <View style={tw`px-30`}>
                                <Divider color='gray' width={0.5} />
                            </View>
                        </View>

                        <InputForm
                            value={inputs.objet}
                            error={errors.objet}
                            onChangeText={(text: any) => handleOnChange('objet', text)}
                            containerStyle={tw`px-3`}
                            label='Sujet'
                            labelStyle={[ tw`text-lg mb-2` ]}
                            placeholder='Objet'
                            maxLength={225}
                            formColor='rgb(209, 213, 219)'
                            inputContainerStyle={[ tw`border rounded px-3`, {height: 45} ]}
                            inputStyle={[tw``, {}]}
                        />
                        <TextareaForm
                            value={inputs.message}
                            error={errors.message}    
                            onChangeText={(text: any) => handleOnChange('message', text)}
                            containerStyle={[tw`px-3`]}
                            label='Message'
                            labelStyle={[tw`text-lg mb-2`]}
                            inputContainerStyle={[tw`rounded px-3`, {minHeight: Platform.OS == 'android' ? 'auto' : 100, maxHeight: 150}]}
                            placeholder='Votre texte ici'
                        />
                        
                    </View>
                    <View style={[ tw`justify-center px-3 mb-5`, {height: 80} ]}>
                        <TouchableOpacity
                            onPress={onHandle}
                            activeOpacity={0.5}
                            style={[ tw`py-3 px-4 rounded`, {backgroundColor: ColorsEncr.main} ]}>
                            <Text style={[ tw`ml-2 text-black text-base text-center`, {fontFamily: polices.times_new_roman} ]}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`px-3`}>
                        <Text style={[tw`mb-3 text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Vous pouvez aussi nous joindre via les canaux ci-après:</Text>
                        <View style={tw`flex-row items-center mb-2`}>
                            <Icon type='material-icon' name='location-pin' color={ColorsEncr.main} />
                            <Text style={[tw`flex-1 text-black ml-2`, {fontFamily: polices.times_new_roman}]} onPress={() => openCoordonateOnMap(geo.lat, geo.lng, waataxi_infos.address)}>{waataxi_infos.address}</Text>
                        </View>
                        <View style={tw`flex-row items-center mb-2`}>
                            <Icon type='material-community' name='email-newsletter' color={ColorsEncr.main} />
                            <Text style={[tw`flex-1 text-black ml-2`, {fontFamily: polices.times_new_roman}]} onPress={() => openUrl(`mailto:${waataxi_infos.email}`)}>{waataxi_infos.email}</Text>
                        </View>
                        <View style={tw`flex-row items-center`}>
                            <Icon type='material-icon' name='phone' color={ColorsEncr.main} />
                            <Text style={[tw`flex-1 text-black ml-2`, {fontFamily: polices.times_new_roman}]} onPress={() => openUrl(`tel:${waataxi_infos.phone}`)}>{waataxi_infos.phone}</Text>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Base>
    )

}

export default HelpView;