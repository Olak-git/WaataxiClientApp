import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalDate, getLocalTime, getLocalTimeStr } from '../../../functions/helperFunction';
import { setReload } from '../../../feature/reload.slice';

interface DetailsNotificationViewProps {
    navigation: any,
    route: any
}
const DetailsNotificationView: React.FC<DetailsNotificationViewProps> = (props) => {

    const dispatch = useDispatch();

    const {navigation, route} = props;

    const {notification} = route.params;

    useEffect(() => {
        // dispatch(setReload(''));
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Notification' />
            <ScrollView contentContainerStyle={tw`px-4`}>
                <Text style={[tw`text-black text-center text-base`]}>{notification.intituler}</Text>
                <View style={tw`d-flex mb-4`}>
                    <Icon type='font-awesome' color={ColorsEncr.main} size={28} reverse name='envelope-open' containerStyle={tw`mx-auto`} />
                </View>
                <Text style={tw`text-black text-justify`}>{notification.passager}</Text>
                <Text style={tw`text-gray-400 mt-4 text-right`}>{getLocalDate(notification.dat)} à {getLocalTime(notification.dat)}</Text>

            </ScrollView>

        </Base>
    )
}

export default DetailsNotificationView;