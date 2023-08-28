import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import Base from '../../../components/Base';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { google_maps_apikey, imageMapPath, LATITUDE_DELTA, LONGITUDE_DELTA, polices } from '../../../data/data';
import tw from 'twrnc';
import { locationPermission, getCurrentLocation } from '../../../functions/helperFunction';
import { ActivityLoading } from '../../../components/ActivityLoading';
import Header from '../../../components/Header';
import { Divider, Icon } from '@rneui/base';
import { ColorsEncr } from '../../../assets/styles';
import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogCovoiturage } from '../../../feature/dialog.slice';
import RNMarker from '../../../components/RNMarker';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
// import { setDisponibiliteCourse, setDisponibiliteReservation } from '../../../feature/init.slice';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';
import { setReload } from '../../../feature/reload.slice';
// import { deleteCourse } from '../../../feature/course.slice';

Geocoder.init(google_maps_apikey, {language : "fr"});

interface FinitionViewProps {
    navigation: any,
    route: any
}
const FinitionView: React.FC<FinitionViewProps> = ({ navigation, route }) => {

    const mapRef = useRef();

    const { category } = route.params;

    const [course, setCourse] = useState(route.params.course);

    // const courseSlice = category == 'ci' ? courses.course : courses.reservation;

    // console.log('Course => ', course);

    const distance = course.nb_km_parcouru;

    const { conducteur } = category == 'reservation-covoiturage' ? course.covoiturage : course;

    const avatar = conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');
    
    const [visible, setVisible] = useState({
        modal: false,
        description_start: false,
        description_end: false
    });

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [endFetch, setEndFetch] = useState(false);

    const [configuration, setConfiguration] = useState<any>(null);

    const goHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Drawer'}]
            })
        )
    }

    const getData = async () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('data-user', conducteur.slug);
        if(category == 'ci') {
            formData.append('course', course.slug);
        } else if(category == 'reservation-course') {
            formData.append('reservation-course', course.slug);
        } else if(category == 'covoiturage') {
            formData.append('covoiturage', course.slug);
        } else if(category == 'reservation-covoiturage') {
            formData.append('reservation-covoiturage', course.slug);
        }
        formData.append('token', user.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setEndFetch(true);
            if(json.success) {
                if(json.course) {
                    // dispatch(setReload(''));
                    setCourse(json.course);
                }
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            setEndFetch(true);
            console.log('FinitionView Error: ', error)
        })
    }

    useEffect(() => {
        // console.log(Object.keys(navigation))
        // console.log(navigation.canGoBack())
        getData();
    }, [])

    return (
        <Base>
            <ModalValidationForm showModal={visible.modal} />
            {navigation.canGoBack() && (
                <Header navigation={navigation} headerTitle='Facture' />
            )}
            {endFetch
            ?
                <>
                <ScrollView contentContainerStyle={tw`px-5 pt-5`}>
                    <View style={tw`mb-5`}>
                        <Text style={[tw`font-black text-center text-black`, {fontFamily: polices.times_new_roman}]}>Course Terminée</Text>
                        <View style={tw`mt-2 px-10`}>
                            <Divider color='gray' />
                        </View>
                    </View>
                    <View style={[tw``]}>
                        <View style={[tw`flex-row items-start mb-2`]}>
                            <Icon type='font-awesome' name='circle-thin' size={22} containerStyle={[tw``, {width: 30}]} />
                            <View style={[tw`ml-2`]}>
                                <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point de départ</Text>
                                <Text style={[tw`text-black`, {fontFamily: polices.times_new_roman}]}>{course.adresse_depart}</Text>
                            </View>
                        </View>
                        <View style={[tw`flex-row items-start mb-2`]}>
                            <Icon type='font-awesome-5' name='map-marker-alt' color={'red'} containerStyle={[tw``, {width: 30}]} />
                            <View style={[tw`ml-2`]}>
                                <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point d'arrivé</Text>
                                <Text style={[tw`text-black`, {fontFamily: polices.times_new_roman}]}>{course.adresse_arrive}</Text>
                            </View>
                        </View>
                    </View>

                    {distance && (
                        <View style={tw`items-center mt-5`}>
                            <Icon type='font-awesome-5' name='car-alt' size={35} reverse />
                            <Text style={[tw`mb-2 text-black`, {fontFamily: polices.times_new_roman}]}>Distance du trajet parcouru</Text>
                            <Text style={[ tw`text-black text-xl font-bold`, {fontFamily: polices.times_new_roman} ]}>{distance} km</Text>
                        </View>
                    )}

                    <View style={tw`mt-5 px-10`}>
                        <Divider color='gray' />
                    </View>

                    <View style={tw`items-center mt-2`}>
                        <Text style={[tw`mb-2 text-black`, {fontFamily: polices.times_new_roman}]}>Tarif de la course</Text>
                        <Text style={[ tw`text-black text-2xl font-black bg-gray-100 p-4`, {fontFamily: polices.times_new_roman} ]}>{getCurrency(course.prix)} FCFA</Text>
                    </View>

                    {/* <View style={tw`items-center mt-4`}>
                        <Icon type='material-community' name='chat-question' size={25} />
                        <Text style={[tw`mb-2 text-black`, {fontFamily: polices.times_new_roman}]}>Il sera prélevé de votre portefeuille {configuration ? configuration.commission_course : 0} % du tarif de la course.</Text>
                    </View> */}

                    <View style={tw`mt-5 px-10`}>
                        <Divider color='gray' />
                    </View>

                    <View style={tw`mt-4`}>
                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Conducteur:</Text>
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text style={[tw`text-black`, {fontFamily: polices.times_new_roman}]}>{conducteur.nom} {conducteur.prenom}</Text>
                            <Text style={[tw`text-black`, {fontFamily: polices.times_new_roman}]}>{conducteur.tel}</Text>
                        </View>
                        <Pressable 
                            onPress={() => navigation.navigate('DashNotationConducteur', {conducteur: conducteur})}
                            style={tw`mt-3`}
                        >
                            <Text style={[tw`text-red-800`, {fontFamily: polices.times_new_roman}]}>Notez votre conducteur</Text>
                        </Pressable>
                    </View>

                    <View style={[tw`items-center my-3`, {}]}>
                        <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                    </View>
                    
                </ScrollView>

                {!navigation.canGoBack() && (
                    <View style={[ tw`flex-row px-5 justify-center items-center`, {height: 90} ]}>
                        <RNDivider size={3} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={goHome}
                            style={[ tw`justify-center items-center rounded-full border border-slate-900 mx-2`, {width: 70, height:70} ]}
                        >
                            <Icon 
                                type='entypo'
                                name='home'
                                color='rgb(15, 23, 42)'
                                size={30}
                                reverse
                            />
                        </TouchableOpacity>
                        <RNDivider size={2} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                    </View>
                )}
                </>
            :
                <ActivityLoading />
            }
        </Base>
    )
}

export default FinitionView;