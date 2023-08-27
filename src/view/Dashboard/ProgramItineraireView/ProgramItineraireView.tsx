import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, DeviceEventEmitter } from 'react-native';
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
import { windowWidth } from '../../../functions/functions';
import RNMarker from '../../../components/RNMarker';

Geocoder.init(google_maps_apikey, {language : "fr"});

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');


interface ProgramItineraireViewProps {
    navigation: any,
    route: any
}
const ProgramItineraireView: React.FC<ProgramItineraireViewProps> = ({ navigation, route }) => {
    
    const mapRef = useRef();
    const markerRef = useRef();
    const flatRef = useRef(null);

    const [visible, setVisible] = useState({
        description_start: false,
        description_end: false
    });

    const {action} = route.params;

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const [currentCoords, setCurrentCoords] = useState(null);

    const [endFetch, setEndFetch] = useState(false);

    const [startAddress, setStartAddress] = useState('Point de Départ');

    const [endAddress, setEndAddress] = useState('Point d\'arrivé');

    const [distance, setDistance] = useState('0 m');

    const [duration, setDuration] = useState('0 s');

    const [state, setState] = useState({
        startingCords: {
            latitude: 48.8534951,//30.7046,
            longitude: 2.3483915
        },
        destinationCords: {},
        coordinate: new AnimatedRegion({
            latitude: 48.8534951,
            longitude: 2.3483915,
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
        if(data.hasOwnProperty('pickupCords') && Object.keys(data.pickupCords).length > 0) {
            setState({
                ...state,
                startingCords: {
                    ...data.pickupCords
                },
                coordinate: new AnimatedRegion({
                    ...coordinate,
                    ...data.pickupCords
                }),
            });
            setStartAddress(data.pickupCords.address);
            onCenter();
        }
        if(data.hasOwnProperty('destinationCords') && Object.keys(data.destinationCords).length > 0) {
            setState({
                ...state,
                destinationCords: {
                    ...data.destinationCords
                }
            })
            setEndAddress(data.destinationCords.address);
        }
    }

    const getStartingLocation = () => {
        navigation.navigate('DashFoundLocation', {bn: 'pickupCords', placeholderText: 'Point de départ', event: 'event.fetchCov'})
    }

    const getDestinationLocation = () => {
        navigation.navigate('DashFoundLocation', {bn: 'destinationCords', placeholderText: 'Destination', event: 'event.fetchCov'})
    }

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            const res = await getCurrentLocation();
            const {latitude, longitude} = res
            animate(latitude, longitude);
            setCurrentCoords(res)
            setState({
                ...state,
                startingCords: {
                    ...startingCords,
                    ...res
                    // latitude: res.latitude,
                    // longitude: res.longitude
                },
                coordinate: new AnimatedRegion({
                    ...coordinate,
                    ...res
                }),
                isLoading: true
            })

            Geocoder.from({lat: res.latitude, lng: res.longitude})
                    .then(json => {
                        setStartAddress(json.results[0].formatted_address);
                        console.log(json.results[0].formatted_address)
                    })
                    .catch(error => console.warn('ProgramItineraireView Error1: ', error));
        }
    }

    const onHandleItineraire = () => {
        navigation.navigate(
            'DashCourseOtherInfos', 
            {
                start_address: startAddress, 
                latlng_depart: {latitude: startingCords.latitude, longitude: startingCords.longitude},
                end_address: endAddress,
                latlng_arrive:  {latitude: destinationCords.latitude, longitude: destinationCords.longitude},
                distance: distance, 
                duration: duration,
                action: route.params.action
            }
        );
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
            console.warn('ProgramItineraireView Error2: ', error)
        });
    }

    DeviceEventEmitter.addListener("event.fetchCov", (eventData) => {
        fetchValues(eventData);
    });

    useEffect(() => {
        getLiveLocation()
    }, [])

    useEffect(() => {
        if(Object.keys(startingCords).length > 0 && Object.keys(destinationCords).length > 0) {
            setEndFetch(true);
        }
        // const interval = setInterval(getLiveLocation, 6000)
        return () => {
            // setState(prevState => ({
            //     ...prevState,
            //     // @ts-ignore
            //     destinationCords: {}
            // }))
            // clearInterval(interval)
        }
    }, [state])

    useEffect(()=>{
        // setTimeout(function () {
        //     console.log("Timer On");
        //     setState({
        //         ...state,
        //         startingCords: {
        //             latitude: 6.506603999999999,
        //             longitude: 2.6111748
        //         },
        //         destinationCords: {
        //             latitude: 6.7368274,
        //             longitude: 2.6636066
        //         },
        //         isLoading: false
        //     });
        //     setStartAddress('Marché Ouando, RNIE1, Porto-Novo, Bénin');
        //     setEndAddress('Sakété, Bénin');
        //     setDistance('30.6 km')
        //     setDuration('1 h')
        // }, 2000)
    },[])

    return (
        <Base>
            {isLoading 
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
                                    <Text onPress={getStartingLocation} style={[ tw`border border-slate-200 rounded-md p-3 text-black`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{startAddress}</Text>
                                </View>
                                <View style={[ tw`` ]}>
                                    <Text onPress={getDestinationLocation} style={[ tw`border border-slate-200 rounded-md p-3 text-black`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{endAddress}</Text>
                                </View>
                            </View>
                        </View>
                        { endFetch && Dimensions.get('screen').width > useWindowWidth && (
                            <View style={[ tw`pr-3`, {width: 200} ]}>
                                <TouchableOpacity
                                    onPress={onHandleItineraire}
                                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                                    <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>Valider</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && (
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{distance}</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            {endFetch && (
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
                        <Marker.Animated
                            draggable
                            ref={markerRef}
                            // image={imageMapPath.icUser}
                            pinColor='#000000'
                            // @ts-ignore
                            coordinate={coordinate}
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
                                    // image={imageMapPath.icCar}
                                    // @ts-ignore
                                    coordinate={destinationCords}
                                    // title={'Destination'} 
                                    // description={endAddress}
                                    onDragEnd={e => {
                                        onDrag(e.nativeEvent.coordinate, 'end');
                                    }}
                                    onPress={() => setVisible((state) => ({...state, description_end: !visible.description_end}))}
                                >
                                    <RNMarker visible={visible.description_end} title='Destination' description={endAddress} src={require("../../../assets/images/icon-car.png")} />
                                </Marker>

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
                </View>

                { endFetch && Dimensions.get('screen').width <= useWindowWidth ?
                    <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
                        <View style={[ tw`px-30 my-3` ]}>
                            <Divider />
                        </View>
                        <View style={[ tw`px-8` ]}>
                            <TouchableOpacity
                                onPress={onHandleItineraire}
                                style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                                <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>Valider</Text>
                            </TouchableOpacity>
                        </View>    
                    </View>
                    : null
                }

                </>
            :
                <ActivityLoading loadingText='Chargement en cours...' navigation={navigation} goBack />
            }
        </Base>
    )
}

export default ProgramItineraireView;