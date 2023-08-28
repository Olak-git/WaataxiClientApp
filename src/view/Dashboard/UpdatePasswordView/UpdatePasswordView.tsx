import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import FlashMessage from '../../../components/FlashMessage';
import Header from '../../../components/Header';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { Logo } from '../../../assets';
import { ColorsEncr } from '../../../assets/styles';
import InputForm from '../../../components/InputForm';
import { Button } from 'react-native-paper';
import { baseUri, fetchUri, toast, validatePassword } from '../../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { clone } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { polices } from '../../../data/data';

interface UpdatePasswordViewProps {
    navigation: any
}
const UpdatePasswordView:React.FC<UpdatePasswordViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [inputs, setInputs] = useState({
        recent_password: '',
        password: '',
        confirmation: ''
    });

    const [errors, setErrors] = useState({
        recent_password: null,
        password: null,
        confirmation: null
    });

    const [visible, setVisible] = useState(false);

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onHandle = () => {
        let valide = true;
        
        if(!inputs.recent_password) {
            handleError('recent_password', 'est requis.');
            valide = false;
        } else {
            handleError('recent_password', null);
        }

        if(!inputs.password) {
            handleError('password', 'est requis.');
            valide = false;
        } else if(!validatePassword(inputs.password)) {
            handleError('password', 'Doit contenir les caractères a-z, A-Z, 0-9 et caractères spéciaux(+,=,@,...)');
            valide = false;
        } else {
            handleError('password', null);
        }

        if(!inputs.confirmation) {
            handleError('confirmation', 'est requis.');
            valide = false;
        } else if(inputs.password && inputs.confirmation !== inputs.password) {
            handleError('confirmation', 'Non conforme.');
            valide = false;
        } else {
            handleError('confirmation', null);
        }

        if(valide) {
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('update-password', null);
            formData.append('account', 'passager');
            formData.append('token', user.slug);
            formData.append('recent_password', inputs.recent_password);
            formData.append('password', inputs.password);
            formData.append('confirmation', inputs.confirmation);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                setVisible(false);
                if(json.success) {
                    toast('SUCCESS', 'Votre mot de passe a bien été modifié.');
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
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
                console.log('UpdatePasswordView Error: ', error)
            })
        }
    }

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Paramètres' />

            <KeyboardAvoidingView behavior={Platform.OS == 'ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                    <View style={[ tw`px-10 mb-3` ]}>
                        <View style={[ tw`items-center my-10` ]}>
                            {/* <Logo /> */}
                            <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
                        </View>
                        <Text style={[ tw`text-center px-5 text-black font-normal text-base mb-5`, {fontFamily: polices.times_new_roman} ]}>Veuillez confirmer votre mot de passe.</Text>
                        
                        <View style={[ tw`bg-white px-3` ]}>
        
                            <InputForm
                                containerStyle={[ tw`` ]}
                                placeholder='Entrez votre mot de passe'
                                value={inputs.recent_password}
                                error={errors.recent_password}
                                onChangeText={(text: any) => handleOnChange('recent_password', text)}
                                password
                                inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                inputStyle={[ tw`py-0` ]}
                            />

                            <InputForm
                                containerStyle={[ tw`` ]}
                                placeholder='Entrez votre nouveau mot de passe'
                                value={inputs.password}
                                error={errors.password}
                                onChangeText={(text: any) => handleOnChange('password', text)}
                                password
                                inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                inputStyle={[ tw`py-0` ]}
                            />

                            <InputForm
                                containerStyle={[ tw`mb-10` ]}
                                placeholder='Confirmation'
                                value={inputs.confirmation}
                                error={errors.confirmation}
                                onChangeText={(text: any) => handleOnChange('confirmation', text)}
                                password
                                inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                inputStyle={[ tw`py-0` ]}
                            />

                            <Button
                                onPress={onHandle}
                                color={ColorsEncr.main}
                                mode='contained'
                                contentStyle={[tw`p-2`]}
                                style={tw``}
                                labelStyle={{ fontFamily: polices.times_new_roman }}
                            >Valider</Button>

                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            
        </Base>
    )
}

export default UpdatePasswordView;