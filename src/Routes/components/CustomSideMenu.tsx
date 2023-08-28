import { View, Text, StatusBar, Platform, Image, Pressable, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { ColorsEncr } from '../../assets/styles'
import { Icon } from '@rneui/base'
import { Accueil, Accueil2 } from '../../assets'
import { getCurrency, windowHeight } from '../../functions/functions'
import DrawerMenu from './DrawerMenu'
import { phone_number_test, polices } from '../../data/data'
import { useSelector } from 'react-redux'
import { Avatar } from 'react-native-paper'

interface CustomSideMenuProps {
    user: any,
    navigation: any
}
const CustomSideMenu: React.FC<CustomSideMenuProps> = ({user, navigation}) => {
    const src = user.img ? {uri: user.img} : require('../../assets/images/user-1.png');
    const {height} = useWindowDimensions();
    const with_portefeuille = useSelector((state: any) => state.init.with_portefeuille);
    
    return (
        <View style={[ tw``, {height: '100%', paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0} ]}>
            <View style={[ tw`justify-center items-center`, {height: 130, backgroundColor: ColorsEncr.main} ]}>
                <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
                    {/* <Image
                        defaultSource={require('../../assets/images/user-1.png')}
                        source={src}
                        style={[tw`rounded-full`, {height: 70, width: 70}]}
                    /> */}
                    <Avatar.Image size={80} source={src} style={{backgroundColor: '#ffffff'}} />
                </Pressable>
                <Text style={[ tw`text-white font-semibold text-center px-3 text-lg`, {width: '100%', fontFamily: 'Rajdhani-Medium'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
            </View>
            <View style={tw`flex-1 pt-3`}>
                <ScrollView>
                    <View style={[ tw`px-4 py-3` ]}>
                        {with_portefeuille && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('DashPortefeuilleD')}
                                style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50` ]}>
                                <Icon type="font-awesome-5" name="wallet" size={25} color={ ColorsEncr.main }/>
                                <View style={[ tw`px-4` ]}>
                                    <Text style={[ tw`text-gray-800 text-xl`, {fontFamily: 'YanoneKaffeesatz-Medium'}, {fontFamily: polices.times_new_roman} ]}>Portefeuille</Text>
                                    <Text style={[ tw`text-black font-bold text-xl`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(user.portefeuille) } F</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        <DrawerMenu navigation={navigation} screenName='DashMyAccount' iconType='material' iconName='account-circle' textMenu='Mon compte' />
                        <DrawerMenu navigation={navigation} screenName='DashHistoriqueCourseInstantannee' screenParams={{history: true, headerTitle: 'Historique'}} iconName='car-alt' textMenu='Mes courses' />
                        <DrawerMenu navigation={navigation} screenName='DashParametres' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                        <DrawerMenu navigation={navigation} screenName='DashHelp' iconType='entypo' iconName='help' textMenu='Aide' containerStyle={[ tw`border-b-0` ]} />
                    </View>
                </ScrollView>
            </View>
            {height === windowHeight && (
                <View style={[tw`absolute bottom-5 left-0`, {width: '100%', height: 200}]}>
                    <Accueil2 width='100%' height={200} opacity={0.2} />
                </View>
            )}
        </View>
    )
}

export default CustomSideMenu