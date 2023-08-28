import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar, DeviceEventEmitter, ActivityIndicator, Modal } from 'react-native';
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
import { RNPModal } from '../../../components/RNPModal';

Geocoder.init(google_maps_apikey, {language : "fr"});

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface RenderItembuttonChoiceLocationProps {
    callAction: any,
    data: any,
    stateCoords: any
}
const RenderItembuttonChoiceLocation: React.FC<RenderItembuttonChoiceLocationProps> = ({...props}) => {
    
    const { callAction, data, stateCoords } = props;

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    return (
        <View style={[ tw` px-8`, {width: useWindowWidth} ]}>
            <View style={[ tw`flex-row items-center`, {} ]}>
                {data.id == 1 && (
                    <Icon 
                        type='ant-design'
                        name='arrowleft'
                        containerStyle={[ tw`mr-1` ]}
                    />
                )}
                <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{ data.label }</Text>
            </View>
            <TouchableOpacity onPress={callAction}
                style={[ tw`bg-white p-3 rounded-lg mt-2 border border-gray-200` ]}>
                <Text style={[ tw`text-center text-black`, {fontFamily: polices.times_new_roman} ]}>{ data.buttonText }</Text>
            </TouchableOpacity>
        </View>
    )
}

interface ProgramCovoiturageViewProps {
    navigation: any,
    route: any
}
const ProgramCovoiturageView: React.FC<ProgramCovoiturageViewProps> = ({ navigation, route }) => {

    const mapRef = useRef();
    const markerRef = useRef();
    const flatRef = useRef(null);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const { course } = route.params;

    const dispatch = useDispatch();

    const dialog = useSelector((state: any) => state.dialog.covoiturage);

    const [visible, setVisible] = useState({
        description_start: false,
        description_end: false
    });

    const [currentCoords, setCurrentCoords] = useState(null);

    const [startFetch, setStartFetch] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [ok, setOk] = useState(false);

    const [startAddress, setStartAddress] = useState(course.adresse_depart);

    const [endAddress, setEndAddress] = useState(course.adresse_arrive);

    const [distance, setDistance] = useState('0 m');

    const [duration, setDuration] = useState('0 s');

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

    const getStartingLocation = () => {
        navigation.navigate('DashFoundLocation', {bn: 'pickupCords', placeholderText: 'Point de départ', event: 'event.fetchCov'})
    }

    const getDestinationLocation = () => {
        navigation.navigate('DashFoundLocation', {bn: 'destinationCords', placeholderText: 'Destination', event: 'event.fetchCov'})
    }

    const getCoordonates = async () => {
        await Geocoder.from(startAddress)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('StartCoords: ', location);
            fetchValues({pickupCords: {latitude: location.lat, longitude: location.lng, address: startAddress}});
            // setStartFetch(true);
        })
        .catch(error => {
            console.warn('ProgramCovoiturageView Error1: ', error)
        });

        await Geocoder.from(endAddress)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('EndCoords: ', location);
            fetchValues({destinationCords: {latitude: location.lat, longitude: location.lng, address: endAddress}});
            // setEndFetch(true);
        })
        .catch(error => {
            console.warn('ProgramCovoiturageView Error2: ', error)
        });

        // setStartFetch(true);
        // setEndFetch(true);

            // const res = await getCurrentLocation();
            // const {latitude, longitude} = res
            // animate(latitude, longitude);
            
            // setCurrentCoords(res)
    }

    const onHandleItineraire = () => {
        navigation.navigate('DashCourseCovoiturageInfos', {
            course: course,
            start_address: startAddress,
            // @ts-ignore 
            latlng_depart: {latitude: startingCords.latitude, longitude: startingCords.longitude},
            end_address: endAddress,
            // @ts-ignore
            latlng_arrive:  {latitude: destinationCords.latitude, longitude: destinationCords.longitude}, 
            distance: distance, 
            duration: duration
        });
    }

    const onDrag = async (address: any, position: string) => {
        await Geocoder.from(address)
        .then(json => {
            if(position == 'start') {
                setState({
                    ...state,
                    startingCords: {
                        ...startingCords,
                        ...address
                    },
                    coordinate: new AnimatedRegion({
                        ...coordinate,
                        ...address
                    })
                })
                setStartAddress(json.results[0].formatted_address);    
            } else {
                setState({
                    ...state,
                    destinationCords:{
                        ...destinationCords,
                        ...address
                    }
                })
                setEndAddress(json.results[0].formatted_address);    
            }

            let location = json.results[0].geometry.location;
            for(let g in json.results[0]) {
                // @ts-ignore
                console.log(g, json.results[0][g]);
            }
        })
        .catch(error => {
            console.warn('ProgramCovoiturageView Error3: ', error)
        });
    }

    DeviceEventEmitter.addListener("event.fetchCov", (eventData) => {
        fetchValues(eventData);
    });

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
        return () => {
            // clearInterval(interval)
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
                                <View style={[ tw`mb-2` ]}>
                                    <Text onPress={getStartingLocation} style={[ tw`border border-slate-200 rounded-md p-3 text-black`, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{startAddress}</Text>
                                </View>
                                <View style={[ tw`` ]}>
                                    <Text onPress={getDestinationLocation} style={[ tw`border border-slate-200 rounded-md p-3 text-black`, {fontFamily: polices.times_new_roman} ]} numberOfLines={1} ellipsizeMode='tail'>{endAddress}</Text>
                                </View>
                            </View>
                        </View>
                        { Dimensions.get('screen').width > useWindowWidth && (
                            <View style={[ tw`pr-3`, {width: 200} ]}>
                                <TouchableOpacity
                                    onPress={onHandleItineraire}
                                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                                    <Text style={[ tw`text-center font-semibold text-black text-lg`, {fontFamily: polices.times_new_roman} ]}>Valider</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && startFetch && (
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{distance}</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && startFetch && (
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Icon type='material-community' name='clock' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs ml-1`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{duration}</Text>
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
                        <Marker.Animated
                            draggable
                            ref={markerRef}
                            // @ts-ignore
                            coordinate={coordinate}
                            // coordinate={startingCords}
                            // title={'Départ'}
                            // description={startAddress}
                            onDragEnd={e => {
                                onDrag(e.nativeEvent.coordinate, 'start');
                                console.log('Coordinate: ', e.nativeEvent.coordinate);
                            }}
                            onPress={() => setVisible((state) => ({...state, description_start: !visible.description_start}))}
                        >
                            <RNMarker visible={visible.description_start} title='Départ' description={startAddress} src={require("../../../assets/images/localisation-user.png")} />
                        </Marker.Animated>

                        { Object.keys(destinationCords).length > 0 && (
                            <>
                                <Marker
                                    draggable
                                    tracksInfoWindowChanges={true}
                                    // @ts-ignore
                                    coordinate={destinationCords}
                                    // title={'Destination'} 
                                    // description={endAddress}
                                    onDragEnd={e => {
                                        onDrag(e.nativeEvent.coordinate, 'end');
                                    }}
                                    onPress={() => setVisible((state) => ({...state, description_end: !visible.description_end}))}
                                >
                                    <RNMarker visible={visible.description_end} title='Destination' description={endAddress} src={require("../../../assets/images/localisation-user.png")} />
                                </Marker>

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
                                        setOk(true);
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
                </View>

                { Dimensions.get('screen').width <= useWindowWidth 
                ?
                    ok
                    ?
                        <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
                            <View style={[ tw`px-30 my-3` ]}>
                                <Divider />
                            </View>
                            <Text style={[tw`px-8 text-center mb-1 text-xs text-gray-500`, {fontFamily: polices.times_new_roman}]}>Si vos adresses départ et arrivée sont les mêmes que celles de la course, cliquer directement sur continuer</Text>
                            <View style={[ tw`px-8` ]}>
                                <TouchableOpacity
                                    onPress={onHandleItineraire}
                                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                                    <Text style={[ tw`text-center font-semibold text-black text-lg`, {fontFamily: polices.times_new_roman} ]}>Continuer</Text>
                                </TouchableOpacity>
                            </View>    
                        </View>
                    :
                        <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
                            <ActivityIndicator color='gray' />
                        </View>
                : null
                }

                </>
            :
                <ActivityLoading loadingText='Chargement en cours...' />
            }

            <RNPModal showModal={!dialog}>
                <View style={[ tw`justify-center items-center`, StyleSheet.absoluteFill, {backgroundColor: 'rgba(0, 0, 0, 0.5)'} ]}>
                    <View style={[ tw`bg-white justify-center items-center rounded-2xl p-3`, {height: 300, width: 300} ]}>
                        <Pressable
                            onPress={() => {
                                dispatch(setDialogCovoiturage(true));
                            }}
                            // @ts-ignore
                            style={[tw`absolute right-5`, {top: Platform.OS == 'android' ? StatusBar.currentHeight + 5 : 5}]}>
                            <Icon type='ant-design' name='close' size={40} color='black' />
                        </Pressable>

                        <Text style={[tw`text-gray-600 text-center text-base`, {fontFamily: polices.times_new_roman}]}>Entrer votre point de départ et votre point d'arrivé si différents de ceux indiqués par le chauffeur. Mais assurez-vous d'être sur l'axe définit par celui-ci.</Text>
                    </View>
                </View>
            </RNPModal>

        </Base>
    )
}

export default ProgramCovoiturageView;