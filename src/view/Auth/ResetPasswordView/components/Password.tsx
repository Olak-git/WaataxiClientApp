import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ColorsEncr } from '../../../../assets/styles'
import InputForm from '../../../../components/InputForm'
import { Icon } from '@rneui/base'
import { CommonActions, useNavigation } from '@react-navigation/native'
import tw from 'twrnc'
import { account, fetchUri, toast, validatePassword } from '../../../../functions/functions'
import { Button } from 'react-native-paper'

interface PasswordProps {
    setConfirm: (a:boolean)=>void,
    email: string,
    tel: string
}
const Password: React.FC<PasswordProps> = ({ setConfirm, email, tel }) => {
    const navigation = useNavigation();

    const [inputs, setInputs] = useState({
        password: '',
        confirmation: ''
    });

    const [errors, setErrors] = useState({
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

    const onCanceled = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Auth'}
                ]
            })
        )
    }

    const onHandle = () => {
        let valide = true;

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
            formData.append('reset-password', null);
            formData.append('account', account);
            formData.append('tel', tel);
            formData.append('email', email);
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
                if(json.success) {
                    toast('SUCCESS', 'Mot de passe réinitialisé. Vous pouvez vous connecter avec le nouveau mot de passe.');
                    setTimeout(onCanceled, 2000)
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                console.log('UpdatePasswordView Error: ', error)
            })
            .finally(() => {
                setVisible(false);
            })
        }
    }
    
    return (
        <>
            {/* <ModalValidationForm showModal={showModal} /> */}
            <View style={[ tw`items-center mt-1 mb-4` ]}>
                <Icon onPress={()=>setConfirm(false)} type='ionicon' name='arrow-back-outline' containerStyle={tw`absolute left-2 top-5`} />
                <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    <Text style={[ tw`text-center text-base text-gray-500 mt-20 mb-2` ]}>Rénitialisation du mot de passe de</Text>
                    <Text style={[ tw`text-center text-base text-black mb-5` ]}>{tel}</Text>
                    
                    {/* <Text style={[ tw`text-center text-base text-black mb-5` ]}>Veuillez entrer votre adresse email</Text> */}
                    
                    <View style={[ tw`px-10`, {} ]}>
                        <InputForm
                            containerStyle={[tw``, {}]}
                            label='Mot de passe'
                            labelStyle={[ tw`text-base mb-2` ]}
                            placeholder='********'
                            formColor='rgb(209, 213, 219)'
                            error={errors.password}
                            value={inputs.password}
                            password
                            onChangeText={(text: string) => handleOnChange('password', text)}
                            inputContainerStyle={[ tw`border rounded px-2`, {height: 55} ]}
                        />

                        <InputForm
                            containerStyle={[tw``, {}]}
                            label='Confirmation'
                            labelStyle={[ tw`text-base mb-2` ]}
                            placeholder='********'
                            formColor='rgb(209, 213, 219)'
                            error={errors.confirmation}
                            value={inputs.confirmation}
                            password
                            onChangeText={(text: string) => handleOnChange('confirmation', text)}
                            inputContainerStyle={[ tw`border rounded px-2`, {height: 55} ]}
                        />

                        <Button onPress={onHandle} mode='outlined' loading={visible} disabled={visible} style={tw`mt-4`} contentStyle={tw`p-2`} color={ColorsEncr.main_sm}>
                            Enregistrer
                        </Button>

                        <Button onPress={onCanceled} mode='contained' style={tw`mt-4`} contentStyle={tw`p-2`} color='rgb(185, 28, 28)'>
                            annuler
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Password