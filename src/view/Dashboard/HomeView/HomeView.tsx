import { Header, Icon } from '@rneui/base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, DrawerLayoutAndroid, FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency, toast, windowHeight, windowWidth } from '../../../functions/functions';
import BottomNavs from '../../../components/BottomNavs';
import { useDispatch, useSelector } from 'react-redux';
import { deleteIndex, setUser } from '../../../feature/user.slice';
import { Accueil, LogoDark, Wallet, WtCar } from '../../../assets';
import { RefreshControl } from 'react-native-gesture-handler';
import { clone } from '../../../functions/helperFunction';
import { statusBarHeight } from '../../../data/data';
import { setCount } from '../../../feature/notifications.slice';
import { setStopped } from '../../../feature/init.slice';
import { setWithPortefeuille } from '../../../feature/init.slice';
import moment from 'moment';
import Pubs from '../../../components/Pubs';

const timer = require('react-native-timer');

// interface RenderNavigationDrawerProps {
//     navigation: any,
//     user: any,
//     closeDrawer: () => void
// }
// export const RenderNavigationDrawer: React.FC<RenderNavigationDrawerProps> = ({ navigation, user, closeDrawer }) => {
//     const src = user.img ? {uri: user.img} : require('../../../assets/images/user-1.png');
//     const {height} = useWindowDimensions();

//     return (
//         <View style={[ tw``, {height: '100%'} ]}>
//             <View style={[ tw`justify-center items-center`, {height: 120, backgroundColor: ColorsEncr.main} ]}>
//                 <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
//                     <Image
//                         defaultSource={require('../../../assets/images/user-1.png')}
//                         source={src}
//                         style={[tw`rounded-full`, {height: 70, width: 70}]}
//                     />
//                 </Pressable>
//                 <Text style={[ tw`text-white font-semibold text-center px-3`, {width: '100%'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
//                 <Pressable onPress={closeDrawer} style={[tw`absolute right-0 top-0`, {}]}>
//                     <Icon type='ionicon' name='close' size={30} />
//                 </Pressable>
//             </View>
//             <ScrollView>
//                 <View style={[ tw`px-4 py-3` ]}>
//                     <TouchableOpacity
//                         onPress={() => navigation.navigate('DashPortefeuille')}
//                         style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50` ]}>
//                         <Icon
//                             type="font-awesome-5"
//                             name="wallet"
//                             size={25}
//                             color={ ColorsEncr.main }/>
//                         <View style={[ tw`px-4` ]}>
//                             <Text style={[ tw`text-gray-800` ]}>Portefeuille</Text>
//                             <Text style={[ tw`text-black font-bold text-xl` ]}>{ getCurrency(user.portefeuille) } F</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <DrawerMenu navigation={navigation} screenName='DashMyAccount' iconType='material' iconName='account-circle' textMenu='Mon compte' />
//                     <DrawerMenu navigation={navigation} screenName='DashHistoriqueCourse' iconName='car-alt' textMenu='Mes courses' />
//                     <DrawerMenu navigation={navigation} screenName='DashParametres' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
//                     <DrawerMenu navigation={navigation} screenName='DashHelp' iconType='entypo' iconName='help' textMenu='Aide' containerStyle={[ tw`border-b-0` ]} />
//                 </View>
//             </ScrollView>
//             {height === windowHeight && (
//                 <Accueil width='100%' opacity={0.2} />
//             )}
//         </View>
//     )
// }

interface HomeViewProps {
    navigation: any
}
const HomeView: React.FC<HomeViewProps> = ({navigation}) => {

    const dispatch = useDispatch();

    const reload = useSelector((state: any) => state.reload.value);

    const notifies = useSelector((state: any) => state.notifications.data);

    const stopped = useSelector((state: any) => state.init.stopped);

    const [countNotifs, setCountNotifs] = useState(0);

    const user = useSelector((state: any) => state.user.data);

    const src = user.img ? {uri: user.img} : require('../../../assets/images/user-1.png');

    const [images, setImages] = useState<any>([]);

    const [annonces, setAnnonces] = useState<any>([]);

    const [refresh, setRefresh] = useState(false);

    const getData = (): void => {
        // console.log('HomeView::getData');
        // if(!stopped) {
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`refresh`, null)
            formData.append('token', user.slug)
            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                // console.log('Annonces: ', json.annonces);
                // console.log('response: ', json);
                setRefresh(false);
                if(json.success) {
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
                    
                    const length = json.annonces.length;
                    const images = [];
                    for (let index = 0; index < length; index++) {
                        images.push({uri: `${baseUri}/assets/articles/${json.annonces[index].article}`});
                    }
                    setImages(images);

                    setAnnonces([...json.annonces]);
                    let c = 0;
                    const notifications = json.notifications;
                    notifications.map((v: any) => {
                        if(notifies.indexOf(v.id) == -1) {
                            c++;
                        }
                    })
                    dispatch(setCount(c))
                    setCountNotifs(c);
                    
                    if(json.with_portefeuille) {
                        dispatch(setWithPortefeuille(json.with_portefeuille))
                    }

                    if(json.app_current_versions) {
                        checkVersion(json.app_current_versions)
                    }
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    let txt = '';
                    if(typeof errors == 'object') {
                        const l = Object.keys(errors).length - 1;
                        let i = 0;
                        for(let k in errors) {
                            if(txt) txt += '\n';
                            txt += '-' + k.replace(/_/g, ' ').replace(/(nb )|( prov)/g, '').replace(/km/g, 'distance') + ': ' + errors[k];
                        }
                    } else {
                        txt = errors;
                    }
                    console.log('Err: ', errors);
                    // setFlash({
                    //     text: txt,
                    //     type: 'error',
                    //     notification: true
                    // });
                }
            })
            .catch(e => {
                setRefresh(false);
                console.warn('HomeView Error: ', e)
            })
        // }
    }

    const onRefresh = (): void => {
        if(stopped) dispatch(setStopped(false))
        setRefresh(true);
        getData();
    }

    const openTimer = () => {
        timer.setInterval('home-data', getData, 5000)
    }
    const clearTimer = () => {
        if(timer.intervalExists('home-data')) timer.clearInterval('home-data')
    }
    const event1 = DeviceEventEmitter.addListener("event.home.opentimer", (_eventData) => {
        openTimer();
    });
    const event2 = DeviceEventEmitter.addListener("event.home.cleartimer", (_eventData) => {
        clearTimer();
    });

    const checkVersion = useCallback((a)=>{
        DeviceEventEmitter.emit('check.version', a)
    }, [])

    useEffect(() => {
        // openTimer()
        return () => {
            event1.remove()
            event2.remove()
        }
    }, [])
    
    useEffect(() => {
        console.log({ stopped });
        if(stopped) {
            clearTimer()
        } else {
            openTimer()
        }
        return () => {
            clearTimer()
        }
    }, [notifies, stopped])

    useEffect(() => {
        getData();
    }, [reload])

    useEffect(()=>{
        if(timer.intervalExists('course-covoiturage-loader-data')) timer.clearInterval('course-covoiturage-loader-data')
        if(timer.intervalExists('course-loader-data')) timer.clearInterval('course-loader-data')
        if(timer.intervalExists('historique-reservations')) timer.clearInterval('historique-reservations')
        dispatch(setStopped(false));
    },[])

    return (
        <Base containerStyle={tw`pt-0`}>

            <View style={[tw`flex-1`]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={['red', 'blue', 'green']}
                            refreshing={refresh}
                            onRefresh={onRefresh}
                            progressBackgroundColor='#ffffff'
                        />
                    }
                    nestedScrollEnabled={false}
                    contentContainerStyle={[tw``, { minHeight: '100%' }]}
                >
                    <View style={[tw`items-center`]}>
                        <WtCar />
                    </View>

                    {annonces.length !== 0
                        ?
                            <Pubs annonces={annonces} images={images} />
                        :
                            <View style={tw`flex-1 my-10 px-5`}>
                                <Text style={tw`text-black mb-2 text-lg font-bold`}>Vous êtes sur <Text style={{color: ColorsEncr.main}}>Waataxi</Text>,</Text>
                                <Text style={tw`text-black mb-2`}>Votre application VTC. Nous mettons à votre disposition des conducteurs/chauffeurs professionnels pour vous aider dans vos différentes courses.</Text>
                                <Text style={tw`text-black mb-2`}>Vous pouvez faire une réservation de course ou soliciter une course instantanée.</Text>
                                <Text style={tw`text-black font-semibold`}>Nous oeuvrons pour votre satisfaction.</Text>
                            </View>
                    }

                </ScrollView>

            </View>

            <View style={[tw`px-5 justify-center`, { height: 90 }]}>
                <BottomNavs navigation={navigation} active={true} />
            </View>
        </Base>
    )
}

export default HomeView;