import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import { account, api_ref, apiv3, baseUri, fetchUri, format_size, headers, toast, validateEmail, validatePassword, windowHeight } from '../../../../functions/functions';
import InputForm from '../../../../components/InputForm';
import { Divider, Icon } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { Button, TextInput } from 'react-native-paper';
import { customGenerateRandomNumber, getErrorResponse } from '../../../../functions/helperFunction';
import { polices } from '../../../../data/data';
import { getNewCodeForAuthAccount } from '../../../../services/races';

interface EmailProps {
    inputs: any,
    errors: any,
    handleOnChange:(a:string,b:any)=>void,
    handleError:(a:string,b:any)=>void,
    pin_count: number
}
const Email:React.FC<EmailProps> = ({ inputs, errors, handleOnChange, handleError, pin_count }) => {

    const {width} = useWindowDimensions();

    const dispatch = useDispatch();

    const navigation = useNavigation();

    const user = useSelector((state: any) => state.user.data)

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Drawer'}
                ]
            })
        )
    }

    const onHandle = () => {
        let valide = true;
        if(!inputs.email) {
            handleError('email', 'est requis.');
            valide = false;
        } else if(!validateEmail(inputs.email)) {
            handleError('email', 'email non valide.');
            valide = false;
        } else {
            handleError('email', null);
        }

        if(valide) {
            const code = customGenerateRandomNumber(pin_count)
            Keyboard.dismiss();
            setShowModal(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('reset_password[account]', account);
            formData.append('reset_password[email]', inputs.email);
            formData.append('reset_password[tel]', inputs.tel);
            formData.append('reset_password[code]', code);
            console.log('DATA: ', formData);

            fetch(apiv3 ? api_ref + '/get_new_code_for_auth_account.php' : fetchUri, {
                method: 'POST',
                body: formData,
                // headers: {
                //     'Accept': 'application/json',
                //     'content-type': 'multipart/form-data'
                // }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if(json.success) {
                    toast('SUCCESS', `Un code de verification a ${pin_count} chiffres vous a été envoyé`)
                    handleOnChange('code', code)
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                    if(errors.hasOwnProperty('user')) {
                        toast('DANGER', errors.user)
                    }
                }
                // setShowModal(false);
            })
            .catch(error => {
                console.log(error)
                getErrorResponse(error)
            })
            .finally(() => {
                setShowModal(false);
            })
        }
    }

    useEffect(() => {
        if(Object.keys(user).length > 0) {
            goDashboard();
        }
    }, [user])

    return (
        <>
            <ModalValidationForm showModal={showModal} />
            <View style={[ tw`items-center mt-1 mb-4` ]}>
                <Icon onPress={()=>navigation.goBack()} type='ionicon' name='arrow-back-outline' containerStyle={tw`absolute left-2 top-5`} /> 
                <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    <Text style={[ tw`text-center text-base text-gray-500 mt-20 mb-2`, {fontFamily: polices.times_new_roman} ]}>Rénitialisation du mot de passe de</Text>
                    <Text style={[ tw`text-center text-base text-black mb-5`, {fontFamily: polices.times_new_roman} ]}>{inputs.tel}</Text>
                    
                    <Text style={[ tw`text-center text-base text-black mb-5`, {fontFamily: polices.times_new_roman} ]}>Veuillez entrer votre adresse email</Text>
                    
                    <View style={[ tw`px-10`, {width: width} ]}>
                        <InputForm
                            containerStyle={[tw``, {}]}                            
                            labelStyle={[ tw`text-lg mb-2` ]}
                            placeholder='monadresse@waa.com'
                            keyboardType='email-address'
                            formColor='rgb(209, 213, 219)'
                            error={errors.email}
                            value={inputs.email}
                            onChangeText={(text: string) => handleOnChange('email', text)}
                            inputContainerStyle={[ tw`border rounded`, {height: 55} ]}
                        />

                        <Divider color={ColorsEncr.main_sm} style={[tw`mb-1 mt-5`]} />
                        <Button onPress={onHandle} mode='outlined' loading={loading} disabled={loading} contentStyle={tw`p-2`} labelStyle={{ fontFamily: polices.times_new_roman }} color={ColorsEncr.main_sm}>
                            Valider
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Email;