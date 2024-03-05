import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { api_ref, apiv3, baseUri, fetchUri, format_size, headers, toast, validateEmail, validatePassword, windowHeight } from '../../../functions/functions';
import FilePicker, { types } from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import InputForm from '../../../components/InputForm';
import { Icon } from '@rneui/base';
import { cameraPermission, clone, getErrorResponse, storagePermission } from '../../../functions/helperFunction';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from '@rneui/themed/dist/Image';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setUser } from '../../../feature/user.slice';
import { Logo } from '../../../assets';
import { otp_authentication, polices } from '../../../data/data';
import { setStopped, setWithPortefeuille } from '../../../feature/init.slice';
import { signup } from '../../../services/races';

interface RegisterViewProps {
    navigation: any,
    route: any
}
const RegisterView:React.FC<RegisterViewProps> = ({ navigation, route }) => {

    const {width} = useWindowDimensions();

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    // console.log('ReduxUser: ', user);

    const [avatar, setAvatar] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);

    const {tel: telephone, country, countryCode} = route.params;

    const [inputs, setInputs] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmation: '',
        profil: {}
    });

    const [errors, setErrors] = useState({
        nom: null,
        prenom: null,
        email: null,
        password: null,
        confirmation: null,
        profil: null
    });

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

    const goBack = () => {
        if(navigation.canGoBack()) {
            navigation.goBack()
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'Auth'}
                    ]
                })
            )
        }
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const getFileName = (type: string) => {
        // @ts-ignore
        if(inputs[type] && inputs[type].name) {
            // @ts-ignore
            return inputs[type].name + ' (' + format_size(inputs[type].size) + ')';
        }
        return 
    }

    const onSelectImage = (file: string) => {
        if(Platform.OS == 'android') {
            handleFilePicker(file)
        } else {
            openLaunchGalery(file)
        }
    }

    const openLaunchGalery = async (file: string) => {
        const granted = await storagePermission();
        if(granted) {
            try {
                const result = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1})
                if(result.assets) {
                    const $file = result.assets[0];
                    console.log('$file: ', $file)
                    if(file == 'profil') setAvatar({uri: $file.uri});
                    handleOnChange(file, {
                        'fileCopyUri': null,
                        'name': $file.fileName,
                        'size': $file.fileSize,
                        'type': $file.type,
                        'uri': $file.uri
                    })
                }
                if(result.didCancel) {
                    console.log('Canceled')
                }
                if(result.errorCode) {
                    console.log('Error Code ', result.errorCode, ', ', result.errorMessage)
                }
            } catch(e) {
                console.log('Error: ', e)
            }
        }
    }    

    const handleFilePicker = async (file: string) => {
        const permissionStorage = await storagePermission();
        if(permissionStorage) {
            try {
                const response = await FilePicker.pick({
                    presentationStyle: 'pageSheet',
                    type: [types.images],
                    allowMultiSelection: false,
                    transitionStyle: 'coverVertical',
                })
                FilePicker.isCancel((err: any) => {
                    console.log(err);
                })
                setAvatar({uri: response[0].uri})
                // console.log(response[0].name + '(' + format_size(response[0].size) + ')');
                handleOnChange(file, response[0]);
    
            } catch(e) {
                console.log(e)
            }
        }
    }

    const onHandle = () => {
        let valide = true;
        handleError('profil', null);
        if(!inputs.nom) {
            handleError('nom', 'est requis.');
            valide = false;
        } else if(!inputs.nom.trim()) {
            handleError('nom', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('nom', null);
        }

        if(!inputs.prenom) {
            handleError('prenom', 'est requis.');
            valide = false;
        } else if(!inputs.prenom.trim()) {
            handleError('prenom', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('prenom', null);
        }

        if(!otp_authentication) {
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
        }

        if(!inputs.email) {
            handleError('email', 'est requis.');
            valide = false;
        } else if(!validateEmail(inputs.email)) {
            handleError('email', 'email non valide.');
            valide = false;
        } else {
            handleError('email', null);
        }
        /* if(inputs.email && !validateEmail(inputs.email)) {
            handleError('email', 'email non valide.');
            valide = false;
        } else {
            handleError('email', null);
        } */

        if(valide) {
            Keyboard.dismiss();
            setShowModal(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('signup[nom]', inputs.nom);
            formData.append('signup[prenom]', inputs.prenom);
            formData.append('signup[email]', inputs.email);
            formData.append('signup[country]', country);
            formData.append('signup[country_code]', countryCode);
            if(!otp_authentication) {
                formData.append('signup[password]', inputs.password);
            }
            formData.append('signup[tel]', telephone);
            formData.append('signup[otp_authentication]', otp_authentication);
            if(Object.keys(inputs.profil).length > 0) {
                formData.append('img', inputs.profil);
            }

            fetch(apiv3 ? api_ref + '/signup.php' : fetchUri, {
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
                // setShowModal(false);
                if(json.success) {
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setStopped(false))
                    if(json.with_portefeuille) {
                        dispatch(setWithPortefeuille(json.with_portefeuille))
                    }
                    dispatch(setUser({...data}));
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                    if(errors.tel) {
                        toast('DANGER', errors.tel);
                    }
                }
            })
            .catch(error => {
                getErrorResponse(error)
                console.log(error)
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
        <Base>
            <ModalValidationForm showModal={showModal} />
            <View style={[ tw`items-center mt-1 mb-4` ]}>
                <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[ tw`text-center text-lg text-black mb-5`, {fontFamily: polices.times_new_roman} ]}>Veuillez renseigner votre compte</Text>
                    
                    <View style={[ tw`px-10 mt-5`, {width: width} ]}>
                        <InputForm
                            placeholder='Saisissez votre Nom'
                            defaultValue={inputs.nom}
                            error={errors.nom}
                            onChangeText={(text: any) => handleOnChange('nom', text)}
                            inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                            inputStyle={[ tw`py-0` ]} 
                        />
                        <InputForm
                            placeholder='Saisissez votre Prénom'
                            defaultValue={inputs.prenom}
                            error={errors.prenom}
                            onChangeText={(text: any) => handleOnChange('prenom', text)}
                            inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                            inputStyle={[ tw`py-0` ]} 
                        />
                        <InputForm
                            placeholder='Entrez votre e-mail'
                            error={errors.email}
                            keyboardType='email-address'
                            onChangeText={(text: any) => handleOnChange('email', text)}
                            inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                            inputStyle={[ tw`py-0` ]}
                            // helper='Optionnel *'
                            helperStyle={tw`text-orange-500`}
                        />
                        {!otp_authentication && (
                            <>
                                <InputForm
                                    placeholder='Saisissez votre mot de passe'
                                    error={errors.password}
                                    onChangeText={(text: any) => handleOnChange('password', text)}
                                    password
                                    inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                    inputStyle={[ tw`py-0` ]} 
                                />
                                <InputForm
                                    placeholder='Confirmez le mot de passe'
                                    error={errors.confirmation}
                                    onChangeText={(text: any) => handleOnChange('confirmation', text)}
                                    password
                                    inputContainerStyle={[{ height: 40, borderBottomWidth: 1, borderBottomColor: ColorsEncr.main_sm }]}
                                    inputStyle={[ tw`py-0` ]} 
                                />
                            </>
                        )}
                        <View style={[tw`flex-row justify-between items-center mt-3`]}>
                            <View style={tw`flex-1 mr-1`}>
                                <Text style={[tw`text-gray-500 text-lg`, {fontFamily: polices.times_new_roman}]}>Photo de profil</Text>
                                {avatar && (
                                    <Text onPress={() => {
                                        setAvatar(null)
                                        handleOnChange('profil', {});
                                        handleError('img', null);
                                    }} style={[tw`text-center text-xs text-gray-400 border border-red-500 rounded-2xl p-1`, {width: 70, fontFamily: polices.times_new_roman}]}>annuler</Text>
                                )}
                                {errors.profil && (
                                    <Text style={[tw`text-orange-700 text-sm`, {fontFamily: polices.times_new_roman}]}>{errors.profil}</Text>
                                )}
                            </View>
                            <Pressable
                                onPress={() => onSelectImage('profil')}
                                style={[tw`border border-gray-300 justify-center items-center`, {height: 120, width: 120}]}
                            >
                                {avatar
                                ?
                                    <Image source={avatar} style={{height: 100, width: 100}} />
                                :
                                    <Icon type='ant-design' name='user' size={40} reverse />
                                }
                            </Pressable>
                        </View>
                    </View>

                    <View style={[ tw`justify-center px-10 mt-10`, {} ]}>
                        <TouchableOpacity
                            onPress={onHandle}
                            style={[ tw`justify-center items-center rounded py-4 px-5`, {backgroundColor: ColorsEncr.main, height: 60} ]}
                        >
                            <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.times_new_roman} ]}>finaliser mon compte</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`flex-row px-10 mt-2`}>
                        <TouchableOpacity onPress={goBack} style={tw``}>
                            <Text style={[tw`text-gray-600`, {fontFamily: polices.times_new_roman}]}>Autre numéro de téléphone ?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Base>
    )
}

export default RegisterView;