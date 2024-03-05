import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { CheckBox, Divider, Icon } from '@rneui/base';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { api_ref, apiv3, arrondir, fetchUri, getCurrency, toast } from '../../../functions/functions';
import {Picker} from '@react-native-picker/picker';
import { RNDivider } from '../../../components/RNDivider';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { CommonActions } from '@react-navigation/native';
import FlashMessage from '../../../components/FlashMessage';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../feature/user.slice';
import { getErrorResponse, getErrorsToString } from '../../../functions/helperFunction';
import { Root } from 'react-native-alert-notification';
import { polices } from '../../../data/data';
import { get_configuration, newReservationCarsharing } from '../../../services/races';

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface CourseCovoiturageInfosViewProps {
    navigation: any,
    route: any
}
const CourseCovoiturageInfosView: React.FC<CourseCovoiturageInfosViewProps> = ({ navigation, route }) => {

    const { start_address, latlng_depart, end_address, latlng_arrive, distance, duration, course } = route.params;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const pickerRef = useRef(null);

    const ref = useRef<BottomSheetRefProps>(null);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const [selectedLanguage, setSelectedLanguage] = useState();

    const [nbPlaces, setNbPlaces] = useState<any>([]);

    const distance_converted = parseFloat(distance.replace(',', '.'));

    const montant = arrondir((course.adresse_depart !== start_address || course.adresse_arrive !== end_address) ? (course.mnt * distance_converted) / course.nb_km : course.mnt, 0);

    const [reservationCourse, setReservationCourse] = useState({
        adresse_depart: start_address, 
        latlng_depart: latlng_depart,
        adresse_arrive: end_address, 
        latlng_arrive: latlng_arrive,
        nb_km: distance,
        nb_place: 1,
        course: course.slug,
        prix: montant,
        duration: duration
    });

    const [prix, setPrix] = useState(montant);

    const [itemSelected, setItemSelected] = useState<number|null>(null);

    const [errors, setErrors] =  useState({
        place: null
    });

    const [visible, setVisible] = useState(false);

    const [endfetch, setEndfetch] = useState(false);

    const [configuration, setConfiguration] = useState({});

    // @ts-ignore
    const frais_reservation = Object.keys(configuration).length !== 0 ? (reservationCourse.prix * configuration.commission_covoiturage) / 100 : 0

    const loaderScreen = (key: string|null|undefined) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'DashCourseCovoiturageReservationLoader', 
                        params: {...reservationCourse, slug: key}
                    }
                ]
            })
        )
    }

    const fetchHandlePlace = () => {
        const nb = parseInt(course.nb_place_restante);
        let places = [];
        for (let index = 1; index <= nb; index++) {
            places.push(index);
        }
        setNbPlaces(places);
    }

    const onHandlePlace = (text: any) => {
        console.log('Place: ', text);
        if(!text) {
            // @ts-ignore
            setErrors(prevState => ({...prevState, place: 'veuillez préciser le nombre de places à prévoir.'}));
        } else if(text<0 || text > 4) {
            // @ts-ignore
            setErrors(prevState => ({...prevState, place: 'veuillez rester dans la tranche de 1 - 4'}));
        } else {
            // @ts-ignore
            setErrors(prevState => ({...prevState, place: null}));
            setReservationCourse(state => ({
                ...state,
                nb_place: text,
                prix: montant * parseInt(text)
            }));
        }
    }

    const onHandle = () => {
        let valide = true;
        let invalidText = '';
        if(!course.adresse_depart) {
            valide = false;
            invalidText += '-Veuillez préciser votre point de départ';
        }
        if(!course.adresse_arrive) {
            valide = false;
            if(invalidText) invalidText += '\n';
            invalidText += '-Veuillez préciser votre point d\'arrivé';
        }
        // @ts-ignore
        // let frais_reservation_covoiturage = (reservationCourse.prix * configuration.commission_covoiturage) / 100;
        // if(parseInt(user.portefeuille) < frais_reservation_covoiturage) {
        //     valide = false;
        //     if(invalidText) invalidText += '\n';
        //     invalidText += 'Désolé, Vous n\'avez pas suffisamment de ressource dans votre portefeuille pour faire une telle réservation.\nVeuillez recharger votre portefeuille.';
        // }

        if(!valide) {
            console.log('Error: ', invalidText);
            toast('DANGER', invalidText, false);
        } else {
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('new-reservation-covoiturage', null);
            formData.append('token', user.slug);
            formData.append(`reservation[adresse_depart]`, reservationCourse.adresse_depart);
            formData.append(`reservation[adresse_arrive]`, reservationCourse.adresse_arrive);
            formData.append(`reservation[nb_km]`, distance_converted);
            formData.append(`reservation[nb_place]`, reservationCourse.nb_place);
            formData.append(`reservation[prix]`, reservationCourse.prix);
            formData.append(`course`, reservationCourse.course);

            for (const key in reservationCourse.latlng_depart) {
                formData.append(`reservation[latlng_depart][${key}]`, reservationCourse.latlng_depart[key]);
            }
            for (const kkey in reservationCourse.latlng_arrive) {
                formData.append(`reservation[latlng_arrive][${kkey}]`, reservationCourse.latlng_arrive[kkey]);
            }

            fetch(apiv3 ? api_ref + '/new_reservation_carsharing.php' : fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                // setVisible(false);
                if(json.success) {
                    toast('SUCCESS', 'Votre course a bien été enregistrée');
                    dispatch(setUser({portefeuille: json.user.portefeuille}));
                    // @ts-ignore
                    // const portefeuille = user.portefeuille - course.type_voiture.frais_reservation;
                    // dispatch(setUser({portefeuille: portefeuille}));
                    setTimeout(() => {
                        loaderScreen(json.key)
                    }, 2000);
                } else {
                    const errors = json.errors;
                    toast('DANGER', getErrorsToString(errors), false)
                    console.log(errors);
                }
            })
            .catch(error => {
                console.log('CourseCovoiturageInfosView Error1: ', error)
                getErrorResponse(error)
            })
            .finally(() => {
                setVisible(false);
            });
        }
    }

    const getConfiguration = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('configuration', null);
        formData.append('token', user.slug);

        fetch(apiv3 ? api_ref + '/get_configuration.php' : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log('Conf: ', json.configuration);
            if(json.success) {
                setConfiguration((state) => ({...state, ...json.configuration}))
            } else {
                const errors = json.errors;
                console.log(errors);
            }
            // setEndfetch(true);
        })
        .catch(error => {
            console.log('CourseCovoiturageInfosView Error2: ', error);
            getErrorResponse(error)
        })
        .finally(()=>{
            if(!endfetch)
                setEndfetch(true);
        })
    }

    const open = (): void => {
        // @ts-ignore
        pickerRef?.current?.focus();
    }
      
    const close = (): void => {
        // @ts-ignore
        pickerRef?.current?.blur();
    }

    useEffect(() => {
        getConfiguration();
        fetchHandlePlace();
        return () => {
            // setItemSelected(null);
            // setIndex(2);
        }
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Course/Covoiturage' />
            <ModalValidationForm showModal={visible} />
            { nbPlaces.length > 0 && endfetch
            ?
                <ScrollView>

                    <View style={[ tw`bg-white p-3 px-5`, {} ]}>

                        <View style={tw``}>
                            <View style={tw`flex-row items-center mb-2`}>
                                <RNDivider containerSize={90} size={1} color='red' />
                                <Text style={[ tw`flex-1 mx-1 border rounded-2xl text-center text-gray-500`, {borderColor: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{ course.adresse_depart !== start_address || course.adresse_arrive !== end_address ? 'Itinéraire Chauffeur' : 'Itinéraire' }</Text>
                                <RNDivider containerSize={90} size={1} color='red' />
                            </View>

                            <View style={[ tw`` ]}>
                                <View style={[ tw`flex-row items-start mb-2` ]}>
                                    <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`pt-1 pl-1 pr-2`} />
                                    <View style={[ tw`ml-2` ]}>
                                        <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point de départ</Text>
                                        <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{course.adresse_depart}</Text>
                                    </View>
                                </View>
                                <View style={[ tw`flex-row items-start mb-2` ]}>
                                    <Icon type='material-community' name='map-marker-outline' size={25} color={'red'} containerStyle={tw`pt-1`} />
                                    <View style={[ tw`ml-2` ]}>
                                        <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point d'arrivé</Text>
                                        <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{course.adresse_arrive}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        { (course.adresse_depart !== start_address || course.adresse_arrive !== end_address) && (
                            <View style={tw`mt-5`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <RNDivider containerSize={90} size={1} color='red' />
                                    <Text style={[ tw`flex-1 mx-1 border rounded-2xl text-center text-gray-500`, {borderColor: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>Votre itinéraire</Text>
                                    <RNDivider containerSize={90} size={1} color='red' />
                                </View>

                                <View style={[ tw`` ]}>
                                    <View style={[ tw`flex-row items-start mb-2` ]}>
                                        <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`pt-1 pl-1 pr-2`} />
                                        <View style={[ tw`ml-2` ]}>
                                            <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point de départ</Text>
                                            <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{start_address}</Text>
                                        </View>
                                    </View>
                                    <View style={[ tw`flex-row items-start mb-2` ]}>
                                        <Icon type='material-community' name='map-marker-outline' size={25} color={'red'} containerStyle={tw`pt-1`} />
                                        <View style={[ tw`ml-2` ]}>
                                            <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point d'arrivé</Text>
                                            <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{end_address}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={[ tw`flex-row justify-between px-2 mt-3 mb-5` ]}>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{distance}</Text>
                            </View>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='material-community' name='clock' size={20} iconStyle={{ color: ColorsEncr.main }} />
                                <Text style={[ tw`text-xs ml-1`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{duration}</Text>
                            </View>
                        </View>

                        <View style={tw`mt-6`}>
                            <View style={tw`flex-row items-center mb-2`}>
                                <RNDivider containerSize={100} size={1} color='red' />
                                <Text style={[ tw`flex-1 mx-1 border rounded-2xl text-center text-gray-500`, {borderColor: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>Passager</Text>
                                <RNDivider containerSize={100} size={1} color='red' />
                            </View>

                            <View style={tw`border border-gray-400 rounded-lg`}>
                                <Picker
                                    ref={pickerRef}
                                    selectedValue={reservationCourse.nb_place}
                                    onValueChange={(itemValue, itemIndex) => onHandlePlace(itemValue)}
                                    mode='dropdown'
                                    dropdownIconRippleColor={ 'silver' }
                                    style={tw`text-black`}
                                >
                                    {nbPlaces.map((p: number, index: number) => 
                                        <Picker.Item key={index.toString()} label={p.toString()} value={p.toString()} />
                                    )}
                                </Picker>
                            </View>
                            {errors.place && (
                                <Text style={[ tw`text-orange-700 text-sm`, {fontFamily: polices.times_new_roman} ]}>{ errors.place }</Text>
                            )}
                        </View>

                        <View style={tw`mt-5`}>
                            <View style={[ tw`px-10 my-3` ]}>
                                <Divider />
                            </View>
                            {/* @ts-ignore */}
                            <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Pour garantir votre place vous payez des frais de réservation s'élevant à: <Text style={[tw`underline`, {color: ColorsEncr.main}]}>{frais_reservation} XOF</Text></Text>
                            <View style={[ tw`px-10 my-3` ]}>
                                <Divider />
                            </View>
                            <Text style={[tw`text-center text-black mb-2`, {fontFamily: polices.times_new_roman}]}>Tarif Course</Text>
                            <View style={[ tw`flex-row mb-3 justify-center items-center border-t border-b border-slate-800 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={40} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-black text-lg font-bold`, {fontFamily: polices.times_new_roman} ]}>{getCurrency(reservationCourse.prix)} XOF</Text>
                            </View>
                            <View style={[ tw`justify-center mt-4`, {height: 80} ]}>
                                <TouchableOpacity
                                    onPress={onHandle}
                                    style={[ tw`justify-center items-center bg-orange-100 rounded py-4 px-5`, {height: 60} ]}
                                >
                                    <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.times_new_roman} ]}>Valider ma course</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                </ScrollView>
            :
                <ActivityLoading />
            }
        </Base>
    )
}

export default CourseCovoiturageInfosView;