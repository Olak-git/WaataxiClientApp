import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { ColorsEncr } from '../assets/styles';
import { baseUri, getCurrency } from '../functions/functions';
import { getLocalDate, getLocalTime } from '../functions/helperFunction';
import { Icon } from '@rneui/themed';
import tw from 'twrnc';
import { WtCar1 } from '../assets';
import { Avatar } from 'react-native-paper';
import { polices } from '../data/data';

interface RenderItemCourseInstantaneProps {
    item: any,
    navigation: any,
    routeName: string,
    disabled?: boolean,
    reservation?: boolean
}

const RenderItemCourseInstantane: React.FC<RenderItemCourseInstantaneProps> = ({item, disabled, reservation, navigation, routeName}) => {
    const path = item.conducteur ? (item.conducteur.img ? {uri: baseUri + '/assets/avatars/' + item.conducteur.img} : require('../assets/images/user-1.png')) : require('../assets/images/icons8-found-user-100.png');
    
    const [color, setColor] = useState('');
    const [etat, setEtat] = useState('');
    const _disabled = item.etat_course == -1

    const setValues = () => {
        if(item.etat_course == 0) {
            setColor('text-gray-500');
            setEtat('En attente de taxi');
        } else if(item.etat_course == 1) {
            setColor('text-sky-600 font-semibold');
            if(reservation) {
                setEtat('Acceptée');
            } else {
                setEtat('Votre taxi arrive');
            }
        } else if(item.etat_course == 10) {
            setColor('text-blue-600 font-bold');
            setEtat('Course en cours');
        } else if(item.etat_course == 11) {
            setColor('text-emerald-700 font-black');
            setEtat('Terminée');
        } else {
            setColor('text-red-600 font-bold');
            setEtat('Annulée par Waa Taxi');
        }
    }

    useEffect(()=>{
        setValues()
    }, [item])

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(routeName, {course: item})}
            disabled={disabled || _disabled}
            style={[ tw`flex-row mb-3 ${_disabled?'bg-gray-100 py-2':''} rounded` ]}>
            {/* <Image source={path} style={[ tw`rounded-full`, {height: 60, width: 60} ]} /> */}
            <Avatar.Image size={60} source={path} style={{backgroundColor: '#f2f2f2'}} />
            <View style={[ tw`flex-1 flex-row items-start justify-between ml-3` ]}>
                <View style={[ tw`flex-1 border-0 border-white` ]}>
                    <Text style={[ tw`text-black text-base font-medium`, {fontFamily:'Itim-Regular'}, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.conducteur ? (item.conducteur.nom + ' ' + item.conducteur.prenom) : 'Waataxi Service' }</Text>
                    <View style={[ tw`` ]}>
                        <View style={tw`flex-row mb-1`}>
                            <Icon type='font-awesome' name='circle-thin' size={15} color='gray' containerStyle={[tw``, {width: 20}]} />
                            <Text style={[ tw`flex-1 text-gray-400 text-xs`, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_depart }</Text>
                        </View>
                        <View style={tw`flex-row`}>
                            <Icon type='material-community' name={'map-marker-outline'} size={18} color='#ff2222' containerStyle={[tw``, {width: 20}]} />
                            <Text style={[ tw`flex-1 text-gray-400 text-xs`, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_arrive }</Text>
                        </View>
                    </View>
                    <Text style={[ tw`text-sm pl-1`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman}, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{reservation?getLocalDate(item.date_depart):getLocalDate(item.dat)} {reservation?item.heure_depart.slice(0, 5):getLocalTime(item.dat)}</Text>
                    <Text style={[ tw`text-sm pl-1 ${color}`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{etat}</Text>
                </View>
                <View style={[ tw`ml-3` ]}>
                    <Text style={[ tw`font-medium text-base text-gray-400`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(item.prix) } F</Text>
                    {disabled && (
                        <Icon type="material-community" name="key-chain" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default RenderItemCourseInstantane;