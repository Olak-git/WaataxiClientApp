import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { api_ref, apiv3, baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorResponse, getLocalDate, getLocalTime, getLocalTimeStr } from '../../../functions/helperFunction';
import { setReload } from '../../../feature/reload.slice';
import { polices } from '../../../data/data';
import { account } from '../../../data/data';

interface DetailsNotificationViewProps {
    navigation: any,
    route: any
}
const DetailsNotificationView: React.FC<DetailsNotificationViewProps> = (props) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const {navigation, route} = props;

    const {notification} = route.params;

    const checkReadedNotification = () => {
        const formData = new FormData()
        formData.append('read-notification', true)
        formData.append('account', account)
        formData.append('token', user.slug);
        formData.append('notification', notification.slug)

        // console.log(formData);

        fetch(apiv3 ? api_ref + '/read_notification.php' : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                console.log(json);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('DetailsNotificationView Error: ', error)
            getErrorResponse(error)
        })
        .finally(() => {

        })
    }

    useEffect(() => {
        checkReadedNotification()
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Notification' />
            <ScrollView contentContainerStyle={tw`px-4`}>
                <Text style={[tw`text-black text-center text-base`, {fontFamily: polices.times_new_roman}]}>{notification.intituler}</Text>
                <View style={tw`mb-4`}>
                    <Icon type='font-awesome' color={ColorsEncr.main} size={28} reverse name='envelope-open' containerStyle={tw`mx-auto`} />
                </View>
                <Text style={[tw`text-black text-justify`, {fontFamily: polices.times_new_roman}]}>{notification.passager}</Text>
                <Text style={[tw`text-gray-400 mt-4 text-right`, {fontFamily: polices.times_new_roman}]}>{getLocalDate(notification.dat)} à {getLocalTime(notification.dat)}</Text>

            </ScrollView>

        </Base>
    )
}

export default DetailsNotificationView;