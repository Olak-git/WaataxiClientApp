import { View, Text, Pressable, Image, useWindowDimensions, StatusBar, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer';
import HelpView from '../view/Dashboard/HelpView/HelpView';
import HistoriqueCourseInstantanneeView from '../view/Dashboard/HistoriqueCourseInstantanneeView/HistoriqueCourseInstantanneeView';
import HomeView from '../view/Dashboard/HomeView/HomeView';
import MyAccountView from '../view/Dashboard/MyAccountView/MyAccountView';
import ParametresView from '../view/Dashboard/ParametresView/ParametresView';
import PortefeuilleView from '../view/Dashboard/PortefeuilleView/PortefeuilleView';
import { Icon } from '@rneui/base';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import { getCurrency, windowWidth } from '../functions/functions';
import { useSelector } from 'react-redux';
import { LogoDark, Wallet } from '../assets';
import { Badge } from 'react-native-paper';
import { DrawerActions } from '@react-navigation/native';
import CustomSideMenu from './components/CustomSideMenu';
import { phone_number_test } from '../data/data';

const HomeHeader: React.FC<{navigation: any}> = ({navigation}) => {
    const notifs = useSelector((state: any) => state.notifications.count)
    const with_portefeuille = useSelector((state: any) => state.init.with_portefeuille);
    useEffect(() => {
        console.log('notifs: ', notifs);
    }, [notifs])
    return (
        <View style={[ tw`flex-row justify-between items-center mb-0`, {width: Platform.OS == 'android' ? '100%' : (windowWidth - 90)} ]}>
            <Text></Text>
            <Text style={[tw`text-black uppercase`, { fontSize: 40, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular', lineHeight: Platform.OS == 'android' ? 55 : 48 }]}>waa<Text style={{ color: ColorsEncr.main }}>taxi</Text></Text>
            <View style={[tw`flex-row items-center`]}>
                {with_portefeuille && (
                    <Pressable onPress={() => navigation.navigate('DashPortefeuille')} style={[tw`mr-2`]}>
                        <Wallet width={22} />
                    </Pressable>
                )}
                <Pressable onPress={() => navigation.navigate('DashNotifications')} style={tw`relative`}>
                    <Icon type='ionicon' name='ios-notifications-sharp' size={30} />
                    <Badge children={notifs} visible={notifs !== 0} style={tw`absolute left-4`} />
                </Pressable>
            </View>
        </View>  
    )
}

const Drawer: React.FC<{navigation: any}> = ({navigation}) => {
    const Drawer = createDrawerNavigator();
    const user = useSelector((state: any) => state.user.data);
    const src = user.img ? {uri: user.img} : require('../assets/images/user-1.png');
    const with_portefeuille = useSelector((state: any) => state.init.with_portefeuille);

    const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

    const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

    return (
        <Drawer.Navigator initialRouteName='DashHome'
            drawerContent={(props) => <CustomSideMenu {...props} user={user} navigation={navigation} />}
            screenOptions={{
                drawerType: 'front',
                headerTintColor: 'black'       
                // headerShown: false,
            }}
        >
            <Drawer.Screen  name='DashHome' component={HomeView} options={{
                drawerLabel: () => <View style={[ tw`justify-center items-center border`, {height: 120, width: '100%'} ]}>
                                        <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
                                            <Image
                                                defaultSource={require('../assets/images/user-1.png')}
                                                source={src}
                                                style={[tw`rounded-full`, {height: 70, width: 70}]}
                                            />
                                        </Pressable>
                                        <Text style={[ tw`text-white font-semibold text-center px-3`, {width: '100%'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
                                    </View>,
                drawerActiveBackgroundColor: '#fff',
                drawerItemStyle: [tw`p-0 m-0`, {backgroundColor: ColorsEncr.main, borderRadius: 0}],
                drawerLabelStyle: [tw`bg-red-500 p-0 m-0`],
                headerTitle: () => <HomeHeader navigation={navigation} />,
            }} />
            {with_portefeuille && (
                <Drawer.Screen  name='DashPortefeuilleD' component={PortefeuilleView} options={{
                    headerShown: false,
                    drawerLabel: () => <View style={[ tw`px-4` ]}>
                        <Text style={[ tw`text-gray-800` ]}>Portefeuille</Text>
                        <Text style={[ tw`text-black font-bold text-xl` ]}>{ getCurrency(user.portefeuille) } F</Text>
                    </View>,
                    drawerItemStyle: [tw`border-b border-slate-50`],
                    drawerLabelStyle: [tw`text-lg text-gray-500`],
                    drawerIcon: () => <Icon type='font-awesome-5' name='wallet' color={ColorsEncr.main} size={25} containerStyle={tw``} />
                }} />
            )}
            <Drawer.Screen  name='DashMyAccount' component={MyAccountView} options={{
                headerShown: false,
                drawerType: 'slide',
                drawerLabel: 'Mon compte',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='material' name='account-circle' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashHistoriqueCourseInstantanneeDr' component={HistoriqueCourseInstantanneeView} options={{
                headerShown: false,
                drawerLabel: 'Mes courses',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='font-awesome-5' name='car-alt' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashParametres' component={ParametresView} options={{
                headerShown: false,
                drawerLabel: 'Paramètres',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='ionicon' name='ios-settings-sharp' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashHelp' component={HelpView} options={{
                headerShown: false,
                drawerLabel: 'Aide',
                drawerItemStyle: [tw``],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='entypo' name='help' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
        </Drawer.Navigator>
    )
}

export default Drawer