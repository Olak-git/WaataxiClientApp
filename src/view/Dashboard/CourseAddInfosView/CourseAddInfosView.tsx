import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { CheckBox, Divider, Icon } from '@rneui/base';
import { Dialog, Skeleton } from '@rneui/themed';
// import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { GestureHandlerRootView, TouchableWithoutFeedback, ScrollView as GHScrollView, FlatList as GHFlatlist } from 'react-native-gesture-handler';
import { BottomSheetRender } from '../../../components/BottomSheetRender';
import { api_ref, apiv3, fetchUri, getCurrency, toast } from '../../../functions/functions';
import { CommonActions } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { getErrorResponse, getErrorsToString, getSqlFormatDate, getSqlFormatDateTime, getSqlFormatTime } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { setRefreshCoursesInstantanees, setRefreshReservations } from '../../../feature/init.slice';
import moment from 'moment';
import { polices } from '../../../data/data';
import { getModelCars, newInstantRace, newReservationRace } from '../../../services/races';

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface CourseAddInfosViewProps {
    navigation: any,
    route: any
}
const CourseAddInfosView: React.FC<CourseAddInfosViewProps> = ({ navigation, route }) => {

    const { start_address, latlng_depart, end_address, latlng_arrive, distance, duration, action } = route.params;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);
    const refresh_ci = useSelector((state: any) => state.init.refresh_ci);

    const ref = useRef<BottomSheetRefProps>(null);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const [typeVoitures, setTypeVoitures] = useState<any>([]);

    const [minType, setMinType] = useState<any|undefined>(undefined);

    const [endFetch, setEndFetch] = useState(false);

    const [openDatePicker, setOpenDatePicker] = useState(false);

    const [openTimePicker, setOpenTimePicker] = useState(false);

    const minimumDate = new Date();

    const [course, setCourse] = useState({
        adresse_depart: start_address, 
        latlng_depart: latlng_depart,
        adresse_arrive: end_address, 
        latlng_arrive: latlng_arrive,
        nb_km_prov: distance,
        nb_place: '1',
        date_depart: new Date(),
        heure_depart: new Date(),
        type_voiture: null,
        prix: 0,
        duration: duration,
    });

    const [errors, setErrors] =  useState({
        nb_place: null,
        heure_depart: null
    });

    const { prix: mnt, nb_place } = course;

    const distance_converted = parseFloat(distance.replace(',', '.'));

    const [itemSelected, setItemSelected] = useState<number|null>(null);

    const [index, setIndex] = useState(2);

    const [visible, setVisible] = useState(false);

    const [visibleDialog, setVisibleDialog] = useState(false);

    const [height, setHeight] = useState(0);

    const loaderScreen = (key: string|null|undefined) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'DashCourseLoader', 
                        // @ts-ignore
                        params: {...course, slug: key, date_depart: moment(course.date_depart).format('DD/MM/YYYY'), heure_depart: moment(course.heure_depart).format('HH:mm'), action: action, types_voiture: typeVoitures}
                     }
                 ]
            })
        )
    }

    const getTypeVoitures = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        formData.append('type_voitures', null);
        formData.append('action', action);

        fetch(apiv3 ? api_ref + '/get_model_cars.php' : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                const types = [...json.types]
                setTypeVoitures([...types]);
                setMinType(json.mini_type)
                dispatch(setUser({portefeuille: json.user.portefeuille}));
                setEndFetch(true);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            getErrorResponse(error)
            console.log('CourseAddInfos Error1: ', error)
        })
        .finally(() => {

        })
    }

    const handleOnChange = (text: any, input: string) => {
        setCourse(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (text: any, input: string) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if(isActive) {
            console.log('ACTIVE !!!');
            ref?.current?.scrollTo(0)
        } else {
            console.log('NO !!!');
            ref?.current?.scrollTo(-100)
        }
        // setIndex(0);
    }, [])

    const selectedDefaultCar = () => {
        // console.log('Default Car');
        if(minType) {
            typeVoitures.map((t:any,i:number)=>{
                if(t.id==minType.id) {
                    const frais = action == 'reservation' ? minType.frais_reservation : minType.tarif_course_km;
                    getApproximativePrice(i, frais)
                }
            })
        }
    }

    const getApproximativePrice = (index: number, frais_km: number) => {
        // console.log({ index });
        // console.log({ typeVoitures });
        // console.log({ typeVoiture: typeVoitures[index] });
        setItemSelected(index);
        // @ts-ignore
        const _distance = parseInt(distance_converted + 0.5);
        const montant = (_distance * frais_km) * parseInt(nb_place);
        setCourse(state => ({
            ...state,
            prix: montant,
            type_voiture: typeVoitures[index]
        }))
    }

    const onHandlePlace = (text: any) => {
        handleOnChange(text, 'nb_place');
        if(!text) {
            handleError('veuillez préciser le nombre de places à prévoir.', 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: 'veuillez préciser le nombre de places à prévoir.'}));
        } else if(text<0 || text > 4) {
            handleError('veuillez rester dans la tranche de 1 - 4', 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: 'veuillez rester dans la tranche de 1 - 4'}));
        } else {
            handleError(null, 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: null}));
        }
    }

    const callFnc = (formData: any, uri: string) => {
        fetch(apiv3 ? api_ref + `/${uri}` : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(async json => {
            setVisible(false);
            if(json.success) {
                toast('SUCCESS', action == 'reservation' ? 'Votre réservation a bien été enregistrée.' : 'Votre course a bien été enregistrée.')
                if(action == 'reservation') {
                    // @ts-ignore
                    const portefeuille = user.portefeuille - course.type_voiture?.frais_reservation;
                    dispatch(setUser({portefeuille: json.user.portefeuille}));
                }
                setTimeout(()=>{
                    loaderScreen(json.key)
                }, 2000);
            } else {
                const errors = json.errors;
                toast('DANGER', getErrorsToString(errors), false)
                console.log('XkX: ', errors);
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('CourseAddInfos Error2: ', error)
            getErrorResponse(error)
        })
        .finally(() => {
            setVisible(false);
        });
    }

    const onHandle = () => {
        Keyboard.dismiss();

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
        if(itemSelected == null) {
            valide = false;
            if(invalidText) invalidText += '\n';
            invalidText += '-Veuillez choisir le type de voiture avec lequel vous souhaitez faire votre course.';
        }

        if(action == 'reservation') {
            if(!course.date_depart) {
                valide = false;
                if(invalidText) invalidText += '\n';
                invalidText += '-Veuillez préciser la date de départ';
            }
            if(!course.heure_depart) {
                valide = false;
                if(invalidText) invalidText += '\n';
                invalidText += '-Veuillez préciser l\'heure de départ';
            }
            // @ts-ignore
            if(parseInt(user.portefeuille) < parseInt(course.type_voiture?.frais_reservation)) {
                valide = false;
                if(invalidText) invalidText += '\n';
                invalidText += 'Désolé, Vous n\'avez pas suffisamment de ressource dans votre portefeuille pour faire une telle réservation.\nVeuillez recharger votre portefeuille.';
            }
            // if(!course.nb_jour || course.nb_jour == 0) {
            //     valide = false;
            //     if(invalidText) invalidText += '\n';
            //     invalidText += '-Veuillez préciser le nombre de jours pendant lesquels vous souhaitez diposer de la voiture de votre choix';
            // }
        }

        if(!valide) {
            console.log('Error: ', invalidText);
            toast('DANGER', invalidText, false)
        } else {
            console.log('COURSE: ', course);
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);

            for (const key in course.latlng_depart) {
                formData.append(`${action}[latlng_depart][${key}]`, course.latlng_depart[key]);
            }
            for (const kkey in course.latlng_arrive) {
                formData.append(`${action}[latlng_arrive][${kkey}]`, course.latlng_arrive[kkey]);
            }

            formData.append(`${action}[adresse_depart]`, course.adresse_depart);
            formData.append(`${action}[adresse_arrive]`, course.adresse_arrive);
            formData.append(`${action}[nb_km_prov]`, distance_converted);
            formData.append(`${action}[prix]`, course.prix);
            // @ts-ignore
            formData.append(`${action}[type_voiture]`, course.type_voiture?.id);

            if(action == 'course') {
                formData.append('new-course', null);
                callFnc(formData, 'new_instant_race.php');
            } else if(action == 'reservation') {
                formData.append('new-reservation-course', null);
                formData.append('reservation[date_depart]', moment(course.date_depart).format('YYYY-MM-DD'));
                formData.append('reservation[heure_depart]', moment(course.heure_depart).format('HH:mm'));

                callFnc(formData, 'new_reservation_race.php');
            }
            console.log('formData => ', formData)
        }
    }

    const toggleDialog = () => {
        setVisibleDialog(!visibleDialog);
    };

    useEffect(() => {
        setVisible(false);
        getTypeVoitures();
        return () => {
            setItemSelected(null);
            setIndex(2);
            setOpenDatePicker(false);
            setOpenTimePicker(false);
        }
    }, [])

    useEffect(()=>{
        if(action == 'course') dispatch(setRefreshCoursesInstantanees(false))
        if(action == 'reservation') dispatch(setRefreshReservations(false))
        return () => {
            dispatch(setRefreshCoursesInstantanees(true))
            dispatch(setRefreshReservations(true))
        }
    },[])

    useEffect(()=>{
        if(typeVoitures.length!=0 && minType!=undefined) {
            selectedDefaultCar()
        }
    }, [typeVoitures, minType])

    // useEffect(()=>{
    //     console.log({ params: route.params });
    // }, [route])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Course' />
            <ModalValidationForm showModal={visible} />
            <Dialog
                isVisible={visibleDialog}
                onBackdropPress={toggleDialog}
            >
                <Text style={[tw`text-black text-base`, {fontFamily: polices.times_new_roman}]}>Le tarif est calculé en fonction du kilomètrage. Celui indiqué est provisoire. La course terminée, vous pouvez payer moins ou plus selon le kilométrage effectué.</Text>
            </Dialog>
            {endFetch
            ?
            <GestureHandlerRootView style={[ tw`flex-1` ]}>
                
                <ScrollView>

                    <View style={[ tw`bg-white p-3 px-5`, {} ]}>

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

                        <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
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

                        <View style={tw`mt-5 px-10`}>
                            <Divider color='gray' />
                        </View>

                        {action == 'reservation' && (
                            <>
                                <View style={[tw`mt-6`]}>
                                    <View style={tw`flex-row justify-between items-start`}>
                                        <View style={tw``}>
                                            <Text onPress={() => setOpenDatePicker(!openDatePicker)} style={[tw`border border-gray-400 rounded-lg p-3 text-black`, {fontFamily: polices.times_new_roman}]}>Date de départ</Text>
                                            {course.date_depart && (
                                                <Text style={[tw`mt-1 text-black font-bold text-center border-b border-gray-300`, {fontFamily: polices.times_new_roman}]}>{ moment(course.date_depart).format('DD/MM/YYYY') }</Text>
                                            )}
                                        </View>
                                        <View style={tw``}>
                                            <Text onPress={() => setOpenTimePicker(!openTimePicker)} style={[tw`border border-gray-400 rounded-lg p-3 text-black`, {fontFamily: polices.times_new_roman}]}>Heure de départ</Text>
                                            {course.heure_depart && (
                                                <Text style={[tw`mt-1 text-black font-bold text-center border-b border-gray-300`, {fontFamily: polices.times_new_roman}]}>{ moment(course.heure_depart).format('HH:mm') }</Text>
                                            )}
                                        </View>
                                    </View>
                                    <DatePicker
                                        modal
                                        open={openDatePicker}
                                        date={course.date_depart}
                                        onConfirm={(date) => {
                                            setOpenDatePicker(false)
                                            handleOnChange(date, 'date_depart');
                                        }}
                                        onCancel={() => {
                                            setOpenDatePicker(false)
                                        }}
                                        minimumDate={minimumDate}
                                        mode='date'
                                        // timeZoneOffsetInMinutes={-7*60}
                                    />
                                    <DatePicker
                                        modal
                                        open={openTimePicker}
                                        date={course.heure_depart}
                                        onConfirm={(date) => {
                                            setOpenTimePicker(false)
                                            handleOnChange(date, 'heure_depart');
                                        }}
                                        onCancel={() => {
                                            setOpenTimePicker(false)
                                        }}
                                        mode='time'
                                        is24hourSource='locale'
                                    />
                                </View>

                                <View style={tw`mt-5`}>
                                    {/* <View style={tw`mt-5 px-10`}>
                                        <Divider color='gray' />
                                    </View> */}

                                    <View style={tw`mt-4 flex-row items-center`}>
                                        <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Frais de réservation: </Text>
                                        {(itemSelected !== null && course.type_voiture) && (
                                            // @ts-ignore
                                            <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>{ getCurrency(course.type_voiture?.frais_reservation) } XOF</Text>
                                        )}
                                    </View>

                                    <View style={tw`mt-5 px-10`}>
                                        <Divider color='gray' />
                                    </View>

                                    {itemSelected !== null && (
                                        <>
                                            <View style={[ tw`flex-row mt-4 items-center` ]}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Tarif course</Text>
                                                    <Pressable onPress={toggleDialog}>
                                                        <Icon type='material-community' name='chat-question' size={25} />
                                                    </Pressable>
                                                    <Text style={[tw`text-gray-500 ml-1`, {fontFamily: polices.times_new_roman}]}>:</Text>
                                                </View>
                                                <View style={tw`flex-row items-center`}>
                                                    <Icon type='material-community' name='approximately-equal' size={30} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                                    <Text style={[ tw`text-black text-lg font-bold`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(mnt) } XOF</Text>
                                                </View>
                                            </View>
                                            <View style={tw`mt-5 px-10`}>
                                                <Divider color='gray' />
                                            </View>
                                        </>
                                        
                                    )}
                                    
                                </View>
                            </>
                        )}

                        {Dimensions.get('screen').width > useWindowWidth && (
                            <View style={[ tw`flex-1 p-3 pb-15 border-t-0 border-slate-200`, {backgroundColor: '#ffffff'} ]}>
                                <BottomSheetRender data={typeVoitures} onSelect={getApproximativePrice} itemSelected={itemSelected} value={course.nb_place} handlePlace={onHandlePlace} error={errors.nb_place} action={action} />
                            </View>
                        )}

                        {action == 'reservation'
                        ?
                            itemSelected !== null && (
                                <>
                                    <View style={tw`mt-5 px-10`}>
                                        <Divider color='gray' />
                                    </View>
                                    <View style={[ tw`justify-center mt-2`, {height: 80} ]}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={onHandle}
                                            style={[ tw`justify-center items-center bg-orange-100 rounded py-4 px-5`, {height: 60} ]}
                                        >
                                            <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: 'MontserratAlternates-SemiBold'} ]}>Valider ma course</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[tw`text-center text-gray-600`, {fontFamily: polices.times_new_roman}]}>Après validation, il vous sera prélevé les frais de réservation de votre portefeuille.</Text>
                                </>
                            )
                        :
                            itemSelected !== null && (
                                <>
                                <View style={[ tw`flex-row mt-10 mb-3 justify-center items-center border-t border-b border-slate-800 rounded-2xl py-1 px-3` ]}>
                                    <Icon type='material-community' name='approximately-equal' size={40} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                    <Text style={[ tw`text-black text-lg font-bold`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(mnt) } XOF</Text>
                                </View>
                                <View style={[ tw`justify-center`, {height: 80} ]}>
                                    <TouchableOpacity
                                        onPress={onHandle}
                                        style={[ tw`justify-center items-center bg-orange-100 rounded py-4 px-5`, {height: 60} ]}
                                    >
                                        <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: 'MontserratAlternates-SemiBold'}, {fontFamily: polices.times_new_roman} ]}>Valider ma course</Text>
                                    </TouchableOpacity>
                                </View>
                                </>
                            )
                        }

                        {/* {itemSelected !== null && (
                            <>
                            <View style={[ tw`flex-row mt-10 mb-3 justify-center items-center border-t border-b border-slate-800 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={40} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-black text-lg font-bold` ]}>{ getCurrency(mnt) } XOF</Text>
                            </View>
                            <View style={[ tw`justify-center`, {height: 80} ]}>
                                <TouchableOpacity
                                    onPress={onHandle}
                                    style={[ tw`justify-center items-center bg-orange-100 rounded py-4 px-5`, {height: 60} ]}
                                >
                                    <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: 'MontserratAlternates-SemiBold'} ]}>Valider ma course</Text>
                                </TouchableOpacity>
                            </View>
                            </>
                        )} */}

                    </View>

                </ScrollView>

                <RNBottomSheet ref={ref} maxHeight={height + 150}>
                    <View onLayout={(event) => {
                                setHeight(event.nativeEvent.layout.height)
                    console.log('HHeight: ', event.nativeEvent.layout.height)
                }} style={[ tw`flex-1 p-3 pb-15 border-t-0 border-slate-200`, {backgroundColor: '#ffffff'} ]}>
                        <GHScrollView nestedScrollEnabled>
                            <BottomSheetRender data={typeVoitures} onSelect={getApproximativePrice} itemSelected={itemSelected} value={course.nb_place} handlePlace={onHandlePlace} error={errors.nb_place} action={action} />
                        </GHScrollView>
                    </View>
                </RNBottomSheet>
            </GestureHandlerRootView>
            :
            <ActivityLoading />
            }
        </Base>
    )
}

export default CourseAddInfosView;