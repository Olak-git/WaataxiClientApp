import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUri, getCurrency, toast } from '../../../functions/functions';
import { formatChaineHid, getErrorsToString } from '../../../functions/helperFunction';
import { deleteUser, setUser } from '../../../feature/user.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import Signout from './components/Signout';
import { setStopped } from '../../../feature/init.slice';
import DelAccount from './components/DelAccount';
import { clearStoreCourses } from '../../../feature/courses.slice';
import { polices } from '../../../data/data';

interface ParametresViewProps {
    navigation: any
}
const ParametresView: React.FC<ParametresViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [dialogSignOut, setDialogSignOut] = useState(false);

    const [dialogDeleteAccount, setDialogDeletAccount] = useState(false);

    const [visible, setVisible] = useState(false);

    const [progress, setProgress] = useState(false);

    const [disabled, setDisabled] = useState(false);

    const signOut = async () => {
        await dispatch(setStopped(true));
        await dispatch(clearStoreCourses())
        setVisible(true);
        setDialogSignOut(false);
        setTimeout(() => {
            setVisible(false);
            dispatch(deleteUser());
        }, 5000)
    }

    const onDeleted = async () => {
        await dispatch(setStopped(true));
        setDialogDeletAccount(false);
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('delete-account', true);
        formData.append('token', user.slug);
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
            console.log(json)
            setVisible(false);
            if(json.success) {
                await dispatch(clearStoreCourses())
                dispatch(deleteUser());
            } else {
                dispatch(setStopped(false));
                const errors = json.errors;
                console.log('Errors: ', errors);
                toast('DANGER', getErrorsToString(errors));
            }
        })
        .catch(error => {
            dispatch(setStopped(false));
            setVisible(false);
            // setDialogDeletAccount(false);
            console.log(error)
        })        
    }

    useEffect(() => {
        return () => {
            setVisible(false);
            setDialogSignOut(false);
            setProgress(false);
        }
    }, [])

    useEffect(()=>{
        dispatch(setStopped(true))
        return ()=>{
            dispatch(setStopped(false))
        }
    }, [])

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            
            <Signout visible={dialogSignOut} setVisible={setDialogSignOut} onSignout={signOut} />

            <DelAccount visible={dialogDeleteAccount} setVisible={setDialogDeletAccount} onDelete={onDeleted} />

            <Header navigation={navigation} headerTitle='Paramètres' />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={tw`px-5`}>
                    <View style={tw`bg-gray-100 rounded-xl p-4`}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('DashUpdateTel')}
                            disabled={disabled}
                            touchSoundDisabled
                            activeOpacity={0.5}
                            style={tw`p-3`}
                        >
                            <View style={tw`flex-row`}>
                                <Text style={[tw`text-base mb-1 text-gray-500`, {fontFamily: polices.times_new_roman}]}>Changer mon numéro</Text>
                                {progress && (
                                    <ActivityIndicator color={ColorsEncr.main} size='small' style={tw`ml-2`} />
                                )}
                            </View>
                            <Text style={[tw`text-xs text-slate-500`, {fontFamily: polices.times_new_roman}]}>Procéder au changement de votre numéro de téléphone.</Text>
                        </TouchableOpacity>
                        <View style={tw`px-5 my-3`}><Divider /></View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('DashUpdatePassword')}
                            disabled={disabled}
                            touchSoundDisabled
                            activeOpacity={0.5}
                            style={tw`p-3`}
                        >
                            <View style={tw`flex-row`}>
                                <Text style={[tw`text-base mb-1 text-gray-500`, {fontFamily: polices.times_new_roman}]}>Modifier mon mot de passe</Text>
                                {progress && (
                                    <ActivityIndicator color={ColorsEncr.main} size='small' style={tw`ml-2`} />
                                )}
                            </View>
                            <Text style={[tw`text-xs text-slate-500`, {fontFamily: polices.times_new_roman}]}>Pour des raisons de sécurité, mettez à jour votre mot de passe.</Text>
                        </TouchableOpacity>
                        <View style={tw`px-5 my-3`}><Divider /></View>

                        <TouchableOpacity
                            onPress={() => setDialogSignOut(true)}
                            activeOpacity={0.5}
                            style={tw`p-3`}
                        >
                            <Text style={[tw`text-base mb-1 text-gray-500`, {fontFamily: polices.times_new_roman}]}>Me déconnecter</Text>
                            <Text style={[tw`text-xs text-slate-500`, {fontFamily: polices.times_new_roman}]}>Procéder à la déconnexion de votre compte. Par mesure de sécurité, il est important de vous déconnecter avant de changer votre téléphone portable.</Text>
                        </TouchableOpacity>
                        <View style={tw`px-5 my-3`}><Divider /></View>

                        <TouchableOpacity
                            onPress={() => setDialogDeletAccount(true)}
                            activeOpacity={0.5}
                            style={tw`p-3`}
                        >
                            <Text style={[tw`text-base mb-1 text-gray-500`, {fontFamily: polices.times_new_roman}]}>Supprimer mon compte</Text>
                            {/*<Text style={[tw`text-xs text-slate-500`, {fontFamily: polices.times_new_roman}]}>La suppression de votre compte</Text>*/}
                        </TouchableOpacity>

                    </View>
                </View>
                
            </ScrollView>
        </Base>
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

export default ParametresView;