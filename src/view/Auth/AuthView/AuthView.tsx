import React, { useCallback, useEffect, useRef, useState } from 'react';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { CommonActions } from '@react-navigation/native';
import FlashMessage from '../../../components/FlashMessage';
import Authenticate from './components/AuthenticateView';
import AuthTelNumberView from './components/AuthTelNumberView';
import { useDispatch, useSelector } from 'react-redux';
import { locationPermission, storagePermission, readPhonePermission } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { CallingCode, CountryCode } from 'react-native-country-picker-modal';
import { Root } from 'react-native-alert-notification';
import { setPresentation } from '../../../feature/init.slice';

interface AuthViewProps {
    navigation: any
}
const AuthView:React.FC<AuthViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [phone, setPhone] = useState('');

    const [countryName, setCountryName] = useState('Bénin');

    const [countryCode, setCountryCode] = useState<CountryCode>('BJ')

    const [callingCode, setCallingCode] = useState<CallingCode>('229')

    const [confirm, setConfirm] = useState<any>(null);

    const getPermissions = async () => {
        const permissionLocation = await locationPermission();
        // const permissionAccessPhoneInfos = await readPhonePermission();
    }

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

    const goRegisterScreen = () => {
        navigation.navigate('Register', {tel: `+${callingCode}${phone}`, country: countryName, countryCode: countryCode, version: 2})
        // navigation.dispatch(
        //     CommonActions.reset({
        //         index: 0,
        //         routes: [
        //             {name: 'Register', params: {tel: `+229${phone}`, version: 2}}
        //         ]
        //     })
        // )
    }

    useEffect(() => {
        if(Object.keys(user).length > 0) {
            goDashboard();
        } else {
            getPermissions();
        }
    }, [user]);

    return (
        <Base>
            {confirm
            ?
                <Authenticate phoneNumber={`+${callingCode}${phone}`} setConfirm={setConfirm} confirm={confirm} registerScreen={goRegisterScreen} />
            :
                <AuthTelNumberView setConfirm={setConfirm} setPhone={setPhone} phone={phone} registerScreen={goRegisterScreen} callingCode={callingCode} setCallingCode={setCallingCode} setCountryName={setCountryName} countryCode={countryCode} setCountryCode={setCountryCode} />
            }
        </Base>
    )
}

export default AuthView;