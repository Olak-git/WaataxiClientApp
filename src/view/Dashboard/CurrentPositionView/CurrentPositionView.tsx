import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar } from 'react-native';
import Base from '../../../components/Base';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { google_maps_apikey, imageMapPath, LATITUDE_DELTA, LONGITUDE_DELTA } from '../../../data/data';
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
import { fetchUri } from '../../../functions/functions';
import { CommonActions } from '@react-navigation/native';
import CompoMarker from '../../../components/CompoMarker';
import CompoMarkerAnimated from '../../../components/CompoMarkerAnimated';

Geocoder.init(google_maps_apikey, {language : "fr"});

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface RenderItembuttonChoiceLocationProps {
    callAction: any,
    data: any,
    stateCoords: any,
}

const BottomButton: React.FC<{buttonTitle: string, pressAction?: any, headerSection?: ReactElement}> = ({buttonTitle, pressAction, headerSection}) => {
    return (
        <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
            {headerSection}
            <View style={[ tw`px-30 my-3` ]}>
                <Divider />
            </View>
            <View style={[ tw`px-8` ]}>
                <TouchableOpacity
                    onPress={pressAction}
                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                    <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>{buttonTitle}</Text>
                </TouchableOpacity>
            </View>    
        </View>
    )
}

interface CurrentPositionViewProps {
    navigation: any,
    route: any
}
const CurrentPositionView: React.FC<CurrentPositionViewProps> = ({ navigation, route }) => {

    const mapRef = useRef();
    const markerRef = useRef();
    const flatRef = useRef(null);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const { category } = route.params;

    const [course, setCourse] = useState(route.params.course);

    const stateCourse = course.etat_course;

    const [show, setShow] = useState(false)

    const { conducteur } = category == 'reservation-covoiturage' ? course.covoiturage : course;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const dialog = useSelector((state: any) => state.dialog.covoiturage);

    const [currentCoords, setCurrentCoords] = useState({});

    const [startFetch, setStartFetch] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [startAddress, setStartAddress] = useState(course.adresse_depart);

    const [endAddress, setEndAddress] = useState(course.adresse_arrive);

    const [distance, setDistance] = useState('0 m');

    const [duration, setDuration] = useState('0 s');

    var timer: any = null;

    const [visible, setVisible] = useState({
        description_start: false,
        description_end: false
    });

    const [state, setState] = useState({
        // startingCords: {
        //     latitude: 6.355457,
        //     longitude: 2.406693
        // },
        startingCords: {},
        destinationCords: {},
        coordinate: new AnimatedRegion({
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        isLoading: false
    });
    const {startingCords, destinationCords, isLoading, coordinate} = state;

    const factScreen = () => {
        if(category == 'reservation-covoiturage') {
            navigation.navigate('DashFinition', {course: course, category: category})
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'DashFinition', params: {course: course, category: category}}]
                })
            )
        }
    }

    const onCenter = () => {
        // @ts-ignore
        mapRef.current?.animateToRegion({
            ...startingCords,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const animate = (latitude: number, longitude: number) => {
        const newCoordinate = {latitude, longitude};
        if(Platform.OS == 'android') {
            // @ts-ignore
            markerRef.current?.animateMarkerToCoordinate(newCoordinate, 7000)
        } else {
            // @ts-ignore
            coordinate.timing(newCoordinate).start();
        }
    }

    const fetchValues = (data: any) => {
        console.log('Data: ', data);
        if(data.hasOwnProperty('pickupCords') && Object.keys(data.pickupCords).length > 0) {
            setState(state => ({
                ...state,
                startingCords: {
                    ...data.pickupCords
                },
                coordinate: new AnimatedRegion({
                    ...coordinate,
                    ...data.pickupCords
                }),
            }));
            setStartAddress(data.pickupCords.address);
            onCenter();
        }
        if(data.hasOwnProperty('destinationCords') && Object.keys(data.destinationCords).length > 0) {
            setState(state => ({
                ...state,
                destinationCords: {
                    ...data.destinationCords
                }
            }));
            setEndAddress(data.destinationCords.address);
        }
    }

    const getCoordonates = async () => {
        if(course.latlng_depart) {
            const coords1 = JSON.parse(course.latlng_depart)
            fetchValues({pickupCords: {...coords1, address: startAddress}});

            const coords2 = JSON.parse(course.latlng_arrive)
            fetchValues({pickupCords: {...coords2, address: endAddress}});
        } else {
            await Geocoder.from(startAddress)
            .then(json => {
                let location = json.results[0].geometry.location;
                console.log('StartCoords: ', location);
                fetchValues({pickupCords: {latitude: location.lat, longitude: location.lng, address: startAddress}});
                // setStartFetch(true);
            })
            .catch(error => {
                console.warn('CurrentPositionView Error1: ', error)
            });

            await Geocoder.from(endAddress)
            .then(json => {
                let location = json.results[0].geometry.location;
                console.log('EndCoords: ', location);
                fetchValues({destinationCords: {latitude: location.lat, longitude: location.lng, address: endAddress}});
                // setEndFetch(true);
            })
            .catch(error => {
                console.warn('CurrentPositionView Error2: ', error)
            });
        }
    }

    const currentCoordonates = async () => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            const response = await getCurrentLocation();
            // console.log('Response: ', response);
            const {latitude, longitude} = response;
            animate(latitude, longitude);
            if(Object.keys(currentCoords).length == 0) {
                setCurrentCoords(
                    new AnimatedRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    })
                )
            } else {
                const newCoordinate = {latitude, longitude};
                if(Platform.OS == 'android') {
                    // @ts-ignore
                    markerRef.current?.animateMarkerToCoordinate(newCoordinate, 7000)
                } else {
                    // @ts-ignore
                    currentCoords.timing(newCoordinate).start();
                }
            }
        }
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
            console.log('CurrentPositionView Error3: ', error)
        })
    }

    useEffect(() => {
        const xTimer = setInterval(getData, 5000);
        if(true) {
            timer = setInterval(currentCoordonates, 1000)
        }
        return () => {
            clearInterval(xTimer);
            if(timer !== null) {
                clearInterval(timer);
            }
        }
    }, [])

    useEffect(() => {
        getCoordonates();
        return () => {
            setStartFetch(false);
            setEndFetch(false);
            // @ts-ignore
            setState(prevState => ({
                ...prevState,
                startingCords: {},
                destinationCords: {},
                isLoading: false
            }))
        }
    }, [])

    useEffect(() => {
        if(Object.keys(startingCords).length > 0 && Object.keys(destinationCords).length > 0) {
            setStartFetch(true);
            setEndFetch(true);
            // setState({
            //     ...state,
            //     isLoading: true
            // })
        }
        if(startFetch && endFetch) {
            setState({
                ...state,
                isLoading: true
            })
        }
    }, [startingCords, destinationCords])

    return (
        <Base>
            {startFetch && endFetch
            ?
            <>
                <View style={[ tw`bg-white p-2`, {minHeight: 100} ]}>
                    <View style={[ tw`flex-row items-start` ]}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[ tw`rounded p-3 px-2`, {backgroundColor: 'transparent'} ]}>
                            <Icon 
                                type='ant-design'
                                name='arrowleft'
                                size={20} />
                        </TouchableOpacity>

                        <View style={[ tw`flex-1 flex-row px-3` ]}>
                            <View style={[ tw`justify-around mr-1` ]}>
                                <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`mt-2`} />
                                <Icon type='material-community' name='dots-vertical' size={20} color={'silver'} />
                                <Icon type='material-community' name='map-marker-outline' size={20} color={'red'} containerStyle={tw`mb-2`} />
                            </View>
                            <View style={[ tw`flex-1` ]}>
                                <View style={[ tw`border border-slate-200 rounded-md mb-2 bg-gray-200` ]}>
                                    <Text style={[ tw`p-3 text-slate-600`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{startAddress}</Text>
                                </View>
                                <View style={[ tw`border border-slate-200 rounded-md bg-gray-200` ]}>
                                    <Text style={[ tw`p-3 text-slate-600`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{endAddress}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && startFetch && (
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{distance}</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && startFetch && (
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Icon type='material-community' name='clock' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs ml-1`, {color: ColorsEncr.main} ]}>{duration}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <MapView
                        // @ts-ignore
                        ref={mapRef}
                        style={StyleSheet.absoluteFill}
                        // @ts-ignore
                        initialRegion={
                            Object.keys(startingCords).length > 0
                            ?
                            {
                                ...startingCords,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }
                            :
                            undefined
                        }
                        onPress={(e) => {
                            setVisible((state) => ({...state, description_start: false, description_end: false}))
                            // @ts-ignore
                            // setCurrentCoords(e.nativeEvent.coordinate)
                            // const {latitude, longitude} = e.nativeEvent.coordinate
                        }}
                    >
                        {/*
                        * (1) : Affiche un marqueur montrant la position du chauffeur pendant la course
                        * (2) : Affiche un marqueur montrant la position courante du passager
                         */}
                        {(category !== 'reservation-covoiturage' && stateCourse > 1) || (category == 'reservation-covoiturage' && stateCourse > 0)
                            ?   <CompoMarkerAnimated 
                                    source={require("../../../assets/images/icons8-voiture-vue-du-dessus-ios-16-filled/icons8-voiture-vue-du-dessus-100.png")}
                                    mapRef={mapRef} rotate={120}
                                />
                            :   <CompoMarkerAnimated 
                                    source={require("../../../assets/images/icons8-street-view-100.png")}
                                    mapRef={mapRef} show={show} imageStyle={{transform: [{rotate: `0deg`}]}}
                                />
                        }

                        {/* Affiche un marqueur indiquqnt le point de départ d'une course */}
                        <CompoMarker coords={startingCords} title='Départ' description={startAddress} source={require("../../../assets/images/icons8-epingle-de-carte-windows-11-color/icons8-epingle-de-carte-96.png")} imageStyle={{}} />

                        { Object.keys(destinationCords).length > 0 && (
                            <>
                                {/* Affiche un marqueur indiquqnt la destination d'une course */}
                                <CompoMarker coords={destinationCords} title='Destination' description={endAddress} source={require("../../../assets/images/epingle-carte.png")} />

                                {/* @ts-ignore */}
                                <MapViewDirections
                                    origin={startingCords}
                                    // @ts-ignore
                                    destination={destinationCords}
                                    apikey={ google_maps_apikey }
                                    language='fr'
                                    optimizeWaypoints={true}
                                    mode='DRIVING' //'WALKING'
                                    precision='high'
                                    strokeWidth={5}
                                    strokeColor="hotpink"
                                    lineDashPattern={[0]}
                                    onStart={params => {
                                        console.log('Params', params);
                                        // {origin, destination, waypoints} = params
                                    }}
                                    onReady={result => {
                                        const {distance, duration, coordinates, legs} = result
                                        const data = legs[0];
                                        // console.log('Result: ', result);
                                        // setStartAddress(data.start_address);
                                        // setEndAddress(data.end_address);
                                        setDistance(data.distance.text);
                                        setDuration(data.duration.text.replace(/heures?/g, 'h').replace(/minutes?/g, 'm').replace(/secondes?/g, ''))
                                        // @ts-ignore
                                        mapRef.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: 30,
                                                bottom: 300,
                                                left: 30,
                                                top: 100
                                            }
                                        })
                                    }}
                                    onError={errorMessage => {
                                        console.log(errorMessage);
                                    }}
                                />
                            </>
                        )}
                    </MapView>

                    <TouchableOpacity
                        onPress={onCenter}
                        style={[ tw`absolute rounded bottom-1 right-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Image 
                            source={imageMapPath.icMapCenter}
                            style={{width: 25, height: 25}} />
                    </TouchableOpacity>

                    {/* Selon que la course n'a pas encore démarré, ce bouton est utilisé pour laisser apparaître ou non la position du chauffeur à un moment t */}
                    {(stateCourse == 0 || ((category == 'ci' || category == 'reservation-course') && stateCourse == 1)) && (
                        <TouchableOpacity
                            onPress={()=>setShow(!show)}
                            style={[ tw`absolute rounded bottom-1 right-15 p-3`, {backgroundColor: show?'rgba(0,0,0,0.2)':'rgba(255, 255, 255, 0.5)'} ]}>
                            <Image 
                                source={require('../../../assets/images/icons8-street-view-100.png')}
                                style={{width: 25, height: 25}} />
                        </TouchableOpacity>
                    )}
                </View>

                {category !== 'reservation-covoiturage'
                ?
                    course.nb_km_parcouru != null
                    ?
                        <BottomButton buttonTitle={'Facture'} pressAction={factScreen} headerSection={<Text style={tw`px-3 text-center text-base text-black`}>Course Terminée</Text>} />
                    : null
                : <BottomButton buttonTitle={'Facture'} pressAction={factScreen} />
                }

            </>
            :
                <ActivityLoading loadingText='Chargement en cours...' />
            }
        </Base>
    )
}

export default CurrentPositionView;