import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { baseUri, fetchUri } from '../../../../functions/functions';
import { clone } from '../../../../functions/helperFunction';
import { setUser } from '../../../../feature/user.slice';
import { Logo } from '../../../../assets';
import InputForm from '../../../../components/InputForm';
import { Button, Chip, Snackbar } from 'react-native-paper';
import { account } from '../../../../data/data';
import { setStopped, setWithPortefeuille } from '../../../../feature/init.slice';
import { useNavigation } from '@react-navigation/native';

interface AuthenticateViewProps {
    phoneNumber: string,
    setConfirm: any,
    confirm: any,
    registerScreen: any
}
const AuthenticateView:React.FC<AuthenticateViewProps> = ({ phoneNumber, setConfirm = ()=>{}, confirm, registerScreen }) => {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [visible, setVisible] = useState(false);

    // const [typeNotification, setTypeNotification] = useState<string|null>(null);

    const [inputs, setInputs] = useState({
        password: '',
        confirmation: ''
    });

    const [errors, setErrors] = useState({
        password: null,
        confirmation: null
    });

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const signIn = () => {
        let valide = true;
        if(!inputs.password) {
            handleError('password', 'Mot de passe obligatoire.');
            valide = false;
        } else {
            handleError('password', null);
        }
        if(valide) {
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('signin[account]', account);
            formData.append('signin[password]', inputs.password);
            formData.append('signin[tel]', phoneNumber);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setVisible(false);
                if(json.success) {
                    const user = json.user;
                    if(user) {
                        let image = json.user.img;
                        const data = clone(json.user);
                        if(data.img) {
                            data.img = `${baseUri}/assets/avatars/${image}`;
                        }
                        if(json.with_portefeuille) {
                            dispatch(setWithPortefeuille(json.with_portefeuille))
                        }
                        dispatch(setStopped(false))
                        dispatch(setUser({...data}));
                    } else {
                        registerScreen();
                    }
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                setVisible(false);
                console.log(error)
            })
        }
    }

    const setTelNumber = () => {
        setConfirm(null);
    }

    return (
        <>
            <ModalValidationForm showModal={visible} />
            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                    <View style={[ tw`px-10` ]}>
                        <View style={[ tw`items-center mt-10 mb-15` ]}>
                            {/* <Logo /> */}
                            <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
                        </View>
                        <Text style={[ tw`text-center px-5 text-black font-normal text-base mt-2 mb-5` ]}>Pour des raisons de sécurité, nous vérifions votre identité.</Text>
                        <View style={[ tw`bg-white px-3 py-4` ]}>
                            <InputForm
                                placeholder='Entrez votre mot de passe'
                                error={errors.password}
                                onChangeText={(text: any) => handleOnChange('password', text)}
                                password
                                inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                inputStyle={[ tw`py-0` ]}
                            />

                            <View style={[ tw`flex-row justify-between items-center mt-3` ]}>
                                <TouchableOpacity onPress={setTelNumber} style={[ tw`mb-2` ]}>
                                    <Text style={[ tw`text-gray-500 text-sm` ]}>Changer de numéro</Text>
                                </TouchableOpacity>

                                {/* <TouchableOpacity style={[ tw`mb-2` ]}>
                                    <Text style={[ tw`text-red-500 text-sm` ]}>Mot de passe oublié ?</Text>
                                </TouchableOpacity> */}
                            </View>

                            <Button
                                onPress={signIn}
                                color={ColorsEncr.main}
                                mode='contained'
                                contentStyle={[tw`p-2`]}
                                style={tw`mt-5`}
                            >Valider</Button>

                        </View>

                        <View style={tw``}>
                            <TouchableOpacity 
                                // @ts-ignore
                                onPress={()=>navigation.navigate('ResetPassword', {tel: phoneNumber})} 
                                style={[ tw`mb-2 mx-auto` ]}
                            >
                                <Text style={[ tw`text-red-600 text-base` ]}>Mot de passe oublié ?</Text>
                            </TouchableOpacity>
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
        // borderColor: "#03DAC6",
        borderColor: ColorsEncr.main_sm,
    },
});

export default AuthenticateView;