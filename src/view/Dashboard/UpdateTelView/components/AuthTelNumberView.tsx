import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import InputForm from '../../../../components/InputForm';
import { Drapeau, Logo } from '../../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUri, toast } from '../../../../functions/functions';
import { setUser } from '../../../../feature/user.slice';
import { getErrorsToString } from '../../../../functions/helperFunction';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'
import { Icon } from '@rneui/base';
import { account } from '../../../../data/data';

interface AuthTelNumberViewProps {
    navigation: any,
    errors: any,
    handleError: any,
    inputs: any,
    handleOnChange: any,
    setVisible: any,
    callingCode: string,
    setCallingCode: any,
    country: string,
    setCountryName: any
}
const AuthTelNumberView:React.FC<AuthTelNumberViewProps> = ({ navigation, setVisible, errors, handleError, inputs, handleOnChange, callingCode, setCallingCode, country, setCountryName }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [disable, setDisable] = useState(true);

    const [phoneError, setPhoneError] = useState<null|string>(null);

    const [visiblePicker, setVisiblePicker] = useState(false)

    const [countryCode, setCountryCode] = useState<CountryCode>(user.country_code ? user.country_code : 'BJ')

    const onSelect = (country: Country) => {
        console.log('Country: ', country)
        setCountryCode(country.cca2)
        setCountryName(country.name)
        // setCountry(country)
        setCallingCode(country.callingCode[0]);
    }

    const goBack = () => {
        navigation.goBack();
    }

    const onHandle = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('update-tel', null);
        formData.append('token', user.slug);
        formData.append('account', account);
        formData.append('tel', `+${callingCode}${inputs.phone}`.replace(/\s/g, ''));
        formData.append('country', country);
        formData.append('country_code', countryCode);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(async json => {
            setVisible(false);
            if(json.success) {
                await dispatch(setUser({tel: json.user.tel, portefeuille: json.user.portefeuille}));
                toast('SUCCESS', 'Votre numéro de téléphone a été modifié.', true, 'Succès');
                setTimeout(goBack, 2000);
            } else {
                const errors = json.errors;
                toast('DANGER', getErrorsToString(errors), true, 'Erreur');
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('AuthTelNumberView Error: ', error)
        })
    }
    // End

    const onHandleSetTel = (value: string) => {
        handleOnChange('phone', value);
        const regExp = /^[0-9]+/g;
        // const regExp = /^[0-9]{8}/g;
        if(regExp.test(value)) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }

    const onHandleValidateTelNumber = async () => {
        let valide = true;
        const regExp = /^[0-9]+/g;
        // const regExp = /^[0-9]{8}/;
        if(inputs.phone) {
            if(!regExp.test(inputs.phone)) {
                valide = false;
                setPhoneError('Format numéro de téléphone incorrect.');
                toast('DANGER', 'Format numéro de téléphone incorrect.', true, 'Erreur');
            }
        } else {
            valide = false;
            handleError('phone', 'Veuillez indiquer votre numéro de téléphone.');
            toast('DANGER', 'Veuillez indiquer votre numéro de téléphone.', true, 'Erreur');
        }

        if(valide) {
            handleError('phone', null);
            setPhoneError(null);
            // setErrors(null);
            onHandle();
        }
    }

    return (
        <ScrollView nestedScrollEnabled={true}>
            <View style={[ tw`px-10` ]}>
                <View style={[ tw`` ]}>
                    <View style={[ tw`items-center my-10` ]}>
                        {/* <Logo /> */}
                        <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
                    </View>
                    <Text style={[ tw`text-lg text-black text-center px-5` ]}>Veuillez entrer un nouveau numéro de téléphone mobile</Text>
                    <View style={[ tw`mt-5 mb-4` ]}>
                        
                        <InputForm 
                            placeholder='Numero de téléphone'
                            placeholderTextColor={'#ccc'}
                            keyboardType='number-pad'
                            maxLength={16}
                            containerStyle={[ tw`mb-10 mt-2` ]}
                            inputParentStyle={[ tw`border-l`, {borderLeftColor: ColorsEncr.main} ]}
                            inputContainerStyle={[ {height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm} ]}
                            inputStyle={[ tw`text-base text-black px-3 py-0` ]}
                            codeCountry={'+'+callingCode}
                            leftComponent={
                                <View style={[ tw`mr-0 flex-row items-center`, {} ]}>
                                    {/* <Drapeau /> */}
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
                                        onClose={() => setVisiblePicker(false)}
                                        visible={visiblePicker}
                                    />
                                    <Icon type='material-community' name='chevron-down' containerStyle={tw``} onPress={() => setVisiblePicker(true)} />
                                </View>
                            }
                            onChangeText={onHandleSetTel}
                            error={errors.phone}
                        />
                        <View style={tw`flex-row`}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                disabled={disable}
                                onPress={onHandleValidateTelNumber}
                                style={[ tw`flex-1 flex-row justify-center items-center rounded py-4 px-5`, {backgroundColor: disable ? 'rgb(229, 231, 235)' : ColorsEncr.main} ]}
                            >
                                <Text style={[ tw`uppercase text-center font-medium text-black`, {color: disable ? 'silver' : '#000'} ]}>valider</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </ScrollView>
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