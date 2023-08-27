import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import FlashMessage from '../../../components/FlashMessage';
import AuthTelNumberView from './components/AuthTelNumberView';
import Header from '../../../components/Header';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import AuthView from './components/AuthView';
import { CallingCode, CountryCode } from 'react-native-country-picker-modal';
import { useSelector } from 'react-redux';

interface UpdateTelViewProps {
    navigation: any
}
const UpdateTelView:React.FC<UpdateTelViewProps> = ({ navigation }) => {

    const user = useSelector((state: any) => state.user.data)

    const [phone, setPhone] = useState('');

    const [countryName, setCountryName] = useState(user.pays);

    const [callingCode, setCallingCode] = useState<CallingCode>('229')

    const [confirm, setConfirm] = useState<any>(null);

    const [inputs, setInputs] = useState({
        password: '',
        phone: ''
    });

    const [errors, setErrors] = useState({
        password: null,
        phone: null
    });

    const [flash, setFlash] = useState({
        text: '',
        type: 'error',
        notification: false,
        title: 'Erreur',
    });

    const [visible, setVisible] = useState(false);

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Paramètres' />
            {confirm
                ?
                    <AuthTelNumberView errors={errors} handleError={handleError} inputs={inputs} handleOnChange={handleOnChange} navigation={navigation} setVisible={setVisible} callingCode={callingCode} setCallingCode={setCallingCode} country={countryName} setCountryName={setCountryName} />
                :
                    <AuthView setConfirm={setConfirm} errors={errors} handleError={handleError} inputs={inputs} handleOnChange={handleOnChange} />
            }
        </Base>
    )
}

export default UpdateTelView;