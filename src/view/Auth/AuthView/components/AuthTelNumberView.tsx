import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import InputForm from '../../../../components/InputForm';
import { baseUri, fetchUri, toast } from '../../../../functions/functions';
import { useDispatch } from 'react-redux';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'
import { Icon } from '@rneui/base';
import { polices } from '../../../../data/data';
import { clear_format_tel, format_tel } from '../../../../functions/helperFunction';

interface AuthTelNumberViewProps {
    setConfirm: any,
    setPhone: any,
    phone: string,
    registerScreen: any,
    callingCode: string,
    setCallingCode: any,
    setCountryName: any,
    countryCode: CountryCode,
    setCountryCode: any
}
const AuthTelNumberView:React.FC<AuthTelNumberViewProps> = ({ setConfirm = ()=>{}, setPhone = ()=>{}, phone, callingCode, setCallingCode, setCountryName,countryCode, setCountryCode, registerScreen }) => {

    const dispatch = useDispatch();
    
    const [progress, setProgress] = useState(false);

    const [disable, setDisable] = useState(true);

    const [visible, setVisible] = useState(false)

    const [phoneError, setPhoneError] = useState<null|string>(null);

    const onSelect = (country: Country) => {
        console.log('Country: ', country)
        setCountryCode(country.cca2)
        setCountryName(country.name)
        // setCountry(country)
        setCallingCode(country.callingCode[0]);
    }

    const confirmationTel = () => {
        setProgress(true);
        setDisable(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('verify[tel]', `+${callingCode}${phone}`);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'content-type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Response: ', response)
            return response.json();
        })
        .then(json => {
            console.log(json)
            setProgress(false);
            setDisable(false);
            if(json.success) {
                const _user = json.user;
                if(_user) {
                    setConfirm(true);
                } else {
                    registerScreen();
                }
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
                for(let k in errors) {
                    // handleError(k, errors[k]);
                }
            }
        })
        .catch(error => {
            console.log(error)
            setProgress(false);
            setDisable(false);
            toast('DANGER', JSON.stringify(error), true, 'Erreur');
        })
    }

    const onHandleSetTel = async (value: string) => {
        // value = await clear_format_tel(value)
        setPhone(value)
        const regExp = /^[0-9]+/g;
        // const regExp = /^[0-9]{8}/g;
        if(regExp.test(value)) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }

    const onHandleValidateTelNumber = () => {
        let valide = true;
        const regExp = /^[0-9]+/g;
        // const regExp = /^[0-9]{8}/;
        if(phone) {
            if(!regExp.test(phone)) {
                valide = false;
                setPhoneError('Format numéro de téléphone incorrect.');
                toast('DANGER', 'Format numéro de téléphone incorrect.', true, 'Erreur');
            }
        } else {
            valide = false;
            setPhoneError('Veuillez indiquer votre numéro de téléphone.');
            toast('DANGER', 'Veuillez indiquer votre numéro de téléphone.', true, 'Erreur');
        }

        if(valide) {
            setPhoneError(null);
            confirmationTel();
        }
    }

    return (
        <>
        <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
            <ScrollView nestedScrollEnabled={true}>
                <View style={[ tw`px-10` ]}>
                    <View style={[ tw`items-center mt-10 mb-15` ]}>
                        <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
                    </View>
                    <Text style={[ tw`text-lg text-black text-center px-5 mt-2 mb-5`, {fontFamily: polices.times_new_roman} ]}>Veuillez entrer votre numéro de téléphone mobile</Text>
                    <View style={[ tw`mt-8 mb-4` ]}>
                        <InputForm 
                            placeholder='Numero de téléphone'
                            placeholderTextColor={'#ccc'}
                            keyboardType='number-pad'
                            maxLength={16}
                            containerStyle={[ tw`mb-10 mt-20` ]}
                            inputParentStyle={[ tw`border-l`, {borderLeftColor: ColorsEncr.main} ]}
                            inputContainerStyle={[ {height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm} ]}
                            inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                            codeCountry={'+'+callingCode}
                            leftComponent={
                                <View style={[ tw`mr-0 flex-row items-center`, {} ]}>
                                    <CountryPicker
                                        translation='fra'
                                        countryCode={countryCode}
                                        withFilter
                                        withFlag
                                        // withCountryNameButton
                                        // withAlphaFilter
                                        withCallingCode
                                        withEmoji
                                        onSelect={onSelect}
                                        onClose={() => setVisible(false)}
                                        visible={visible}
                                    />
                                    <Icon type='material-community' name='chevron-down' containerStyle={tw``} onPress={() => setVisible(true)} />
                                </View>                       
                            }
                            onChangeText={onHandleSetTel}
                            error={phoneError}
                            // value={format_tel(phone)}
                        />
                        <View style={tw`flex-row`}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                disabled={disable}
                                onPress={onHandleValidateTelNumber}
                                style={[ tw`flex-1 flex-row justify-center items-center rounded py-4 px-5`, {backgroundColor: disable ? 'rgb(229, 231, 235)' : ColorsEncr.main} ]}
                            >
                                {progress && (
                                    <ActivityIndicator color='#000000' size='small' style={tw`mr-2`} />
                                )}
                                <Text style={[ tw`uppercase text-center font-medium text-black`, {color: disable ? 'silver' : '#000', fontFamily: polices.times_new_roman} ]}>valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: ColorsEncr.main_sm
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});

export default AuthTelNumberView;