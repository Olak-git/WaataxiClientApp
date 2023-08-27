import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import TextareaForm from '../../../components/TextareaForm';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, setUser } from '../../../feature/user.slice';
import FilePicker, { types } from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { baseUri, fetchUri, format_size, toast, validateEmail } from '../../../functions/functions';
import { clone, storagePermission } from '../../../functions/helperFunction';
import FlashMessage from '../../../components/FlashMessage';

const SectionData: React.FC<{
    iconType?: string,
    iconName: string,
    iconSize?: number,
    text: string
}> = ({iconType = 'font-awesome-5', iconName, iconSize = 20, text}) => {
    return (
        <View style={tw`flex-row mb-3 pb-2 border-b border-gray-200`}>
            <Icon type={iconType} name={iconName} size={iconSize} />
            <Text style={tw`text-black ml-2`}>{text}</Text>
        </View>  
    )
}

interface EditMyAccountViewProps {
    navigation: any
}
const EditMyAccountView: React.FC<EditMyAccountViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const src = user.img ? {uri: user.img} : require('../../../assets/images/user-1.png');

    const [avatar, setAvatar] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);

    const [inputs, setInputs] = useState({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        img: {}
    })

    const [errors, setErrors] = useState({
        nom: null,
        prenom: null,
        email: null,
        img: null
    })

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
                    setAvatar({uri: $file.uri});
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
                    transitionStyle: 'coverVertical',
                })
                FilePicker.isCancel((err: any) => {
                    console.log(err);
                })
                setAvatar({uri: response[0].uri});
                // console.log(response[0].name + '(' + format_size(response[0].size) + ')');
                handleOnChange(file, response[0])

            } catch(e) {
                console.log(e)
            }
        }
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onHandle = () => {
        let valide = true;
        handleError('img', null);
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

        if(inputs.email && !validateEmail(inputs.email)) {
            handleError('email', 'email non valide.');
            valide = false;
        } else {
            handleError('email', null);
        }

        if(valide) {
            Keyboard.dismiss();
            setShowModal(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('profil[nom]', inputs.nom);
            formData.append('profil[prenom]', inputs.prenom);
            formData.append('profil[email]', inputs.email == null ? '' : inputs.email);
            if(Object.keys(inputs.img).length > 0) {
                formData.append('img', inputs.img);
            }
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false);
                if(json.success) {
                    console.log('User: ', json.user)
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    await dispatch(setUser({...data}));
                    setAvatar(null)
                    setAvatar(null)
                    toast('SUCCESS', 'Compte modifié.')
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                setShowModal(false);
                console.log('EditMyAccountView Error: ', error)
            })
        }
    }
    
    return (
        <Base>
            <ModalValidationForm showModal={showModal} />

            <Header navigation={navigation} headerTitle='Compte' />

            <KeyboardAvoidingView behavior={Platform.OS == 'ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={[ tw`mt-8 mb-3 px-5` ]}>

                        <Text style={tw`text-black text-center text-lg mb-8`}>Editer votre compte</Text>

                        <InputForm
                            containerStyle={tw`mb-4`}
                            placeholder='Saisissez votre Nom'
                            defaultValue={inputs.nom}
                            error={errors.nom}
                            onChangeText={(text: any) => handleOnChange('nom', text)}
                            formColor='rgb(209, 213, 219)'
                            inputContainerStyle={[tw`border rounded`]}
                            inputStyle={[ tw`py-0` ]} 
                        />
                        <InputForm
                            containerStyle={tw`mb-4`}
                            placeholder='Saisissez votre Prénom'
                            defaultValue={inputs.prenom}
                            error={errors.prenom}
                            onChangeText={(text: any) => handleOnChange('prenom', text)}
                            formColor='rgb(209, 213, 219)'
                            inputContainerStyle={[tw`border rounded`]}
                            inputStyle={[ tw`py-0` ]} 
                        />
                        <InputForm
                            containerStyle={tw`mb-4`}
                            placeholder='Entrez votre e-mail'
                            keyboardType='email-address'
                            defaultValue={inputs.email}
                            error={errors.email}
                            onChangeText={(text: any) => handleOnChange('email', text)}
                            formColor='rgb(209, 213, 219)'
                            inputContainerStyle={[tw`border rounded`]}
                            inputStyle={[ tw`py-0` ]} 
                        />

                        <View style={[tw`flex-row justify-between items-center mt-3`]}>
                            <View style={tw`flex-1 mr-1`}>
                                <Text style={tw`text-gray-500 text-lg`}>Photo de profil</Text>
                                {avatar && (
                                    <Text onPress={() => {
                                        setAvatar(null);
                                        handleOnChange('img', {});
                                        handleError('img', null);
                                    }} style={[tw`text-center text-xs text-gray-400 border border-red-500 rounded-2xl p-1`, {width: 70}]}>annuler</Text>
                                )}
                                {errors.img && (
                                    <Text style={tw`text-orange-700 text-sm`}>{errors.img}</Text>
                                )}
                            </View>
                            <Pressable
                                onPress={() => onSelectImage('img')}
                                style={[tw`border border-gray-300 justify-center items-center`, {height: 120, width: 120}]}
                            >
                                {avatar 
                                    ? <Image source={avatar} style={[{width: '100%', height: '100%'}]} />
                                    : <Image source={src} style={[{width: '100%', height: '100%'}]} />
                                }
                            </Pressable>
                        </View>

                        <View style={[ tw`justify-center mt-10` ]}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onHandle}
                                style={[ tw`justify-center items-center rounded border border-gray-300 py-4 px-5` ]}
                            >
                                <Text style={[ tw`uppercase text-center font-medium text-black` ]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </Base>
    )

}

export default EditMyAccountView;