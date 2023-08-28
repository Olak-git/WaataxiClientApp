import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import { baseUri, fetchUri, getCurrency, getDate, toast, windowHeight } from '../../../functions/functions';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView, TouchableWithoutFeedback, ScrollView as GHScrollView, FlatList as GHFlatlist } from 'react-native-gesture-handler';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { SheetRender } from './components/SheetRender';
import { callPhoneNumber, getErrorsToString, openUrl } from '../../../functions/helperFunction';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setRefreshCoursesInstantanees, setRefreshReservations, setStopped } from '../../../feature/init.slice';
import { BottomSheetRender } from '../../../components/BottomSheetRender';
import Pubs from '../../../components/Pubs';
import { polices } from '../../../data/data';

const timer = require('react-native-timer');

interface CourseLoaderViewProps {
    navigation: any,
    route: any
}
const CourseLoaderView: React.FC<CourseLoaderViewProps> = ({ navigation, route }) => {

    const user = useSelector((state: any) => state.user.data);

    const stopped = useSelector((state: any) => state.init.stopped);
    const refresh_ci = useSelector((state: any) => state.init.refresh_ci);
    const refresh_cr = useSelector((state: any) => state.init.refresh_cr);

    const dispatch = useDispatch();

    const ref = useRef<BottomSheetRefProps>(null);

    const { slug, adresse_depart, adresse_arrive, nb_km_prov, nb_place, date_depart, heure_depart, type_voiture, prix, duration, action } = route.params;

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const [state, setState] = useState(0)
    const [mnt, setMnt] = useState(prix);
    const [course, setCourse] = useState<any>(null);

    const conducteur_img = course ? (course.conducteur && course.conducteur.img ? {uri: baseUri + '/assets/avatars/' + course.conducteur.img} : require('../../../assets/images/user-1.png')) : require('../../../assets/images/user-1.png');

    const [height, setHeight] = useState(0);
    const [itemSelected, setItemSelected] = useState<number|null>(null);
    const [typeVoitures, setTypeVoitures] = useState<any>(route.params.types_voiture||[]);
    const [visible, setVisible] = useState(false)
    const [showBottomSheet, setShowBottomSheet] = useState(false)

    const [annonces, setAnnonces] = useState<any>([]);

    const goHome = () => {
        if(stopped) dispatch(setStopped(false));
        if(!refresh_ci) dispatch(setRefreshCoursesInstantanees(true))
        if(!refresh_cr) dispatch(setRefreshReservations(true))
        if(timer.timeoutExists('course-loader-sheet')) timer.clearTimeout('course-loader-sheet')
        if(timer.intervalExists('course-loader-data')) timer.clearInterval('course-loader-data')
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Drawer'}]
            })
        )
    }

    const getData = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('refresh-course', null);
        formData.append('token', user.slug);
        if(action == 'reservation') {
            formData.append('reservation-course', slug);
        } else if(action == 'course') {
            formData.append('course', slug);
        }
        // console.log('FormData: ', formData);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                // console.log('Course: ', json.course);
                if(json.course) {
                    setCourse(json.course)
                    setState(json.course.etat_course)
                    setMnt(json.course.prix)
                }
                if(json.annonces) {
                    setAnnonces([...json.annonces])
                }
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('CourseLoaderView Error1: ', error);
        })
    }

    const onHandle = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('update-course', null);
        formData.append('token', user.slug);
        formData.append('key', slug);
        // @ts-ignore
        formData.append(`type_voiture`, typeVoitures[itemSelected].id);
        console.log('FormData: ', formData)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setVisible(false);
            if(json.success) {
                toast('SUCCESS', 'Vous avez modifié le type de voiture pour votre course.')
                setItemSelected(null)
            } else {
                const errors = json.errors;
                toast('DANGER', getErrorsToString(errors), false)
                console.log(errors);
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('CourseLoaderView Error2: ', error)
        });
    }

    const onSelectedItem = (index: number, frais_km: number) => {
        setItemSelected(index);
    }

    useEffect(() => {
        // const timer = setTimeout(() => {
        //     goHome();
        // }, 10000)
        // return () => {
        //     clearTimeout(timer);
        // }
        if(state == 0) timer.setTimeout('course-loader-sheet', ()=>setShowBottomSheet(true), 300000)
        else setShowBottomSheet(false)
        
        return () => {
            if(timer.timeoutExists('course-loader-sheet')) timer.clearTimeout('course-loader-sheet')
        }
    }, [action, state])

    useEffect(()=>{
        timer.setInterval('course-loader-data', getData, 2000)
        return ()=>{
            if(timer.intervalExists('course-loader-data')) timer.clearInterval('course-loader-data')
        }
    },[])

    useEffect(()=>{
        console.log('Params: ', route.params)
        dispatch(setStopped(true));
    }, [])
    
    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <GestureHandlerRootView style={[ tw`flex-1` ]}>
                <ScrollView>
                    <View style={[ tw`bg-white pt-8 px-5` ]}>

                        <View style={[ tw`` ]}>
                            <View style={[ tw`flex-row items-start mb-2` ]}>
                                <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`pt-1 pl-1 pr-2`} />
                                <View style={[ tw`ml-2` ]}>
                                    <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point de départ</Text>
                                    <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{adresse_depart}</Text>
                                </View>
                            </View>
                            <View style={[ tw`flex-row items-start mb-2` ]}>
                                <Icon type='material-community' name='map-marker-outline' size={25} color={'red'} containerStyle={tw`pt-1`} />
                                <View style={[ tw`ml-2` ]}>
                                    <Text style={[tw`text-gray-500`, {fontFamily: polices.times_new_roman}]}>Point d'arrivé</Text>
                                    <Text style={[ tw`text-black`, {fontFamily: polices.times_new_roman} ]}>{adresse_arrive}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{nb_km_prov}</Text>
                            </View>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='material-community' name='clock' size={20} iconStyle={{ color: ColorsEncr.main }} />
                                <Text style={[ tw`text-xs ml-1`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{duration}</Text>
                            </View>
                        </View>

                        {action == 'reservation'
                        ?
                            <>
                                {/* <View style={tw`flex-row px-2 mt-5 mb-3`}>
                                    <Text style={tw`text-black font-bold`}>Date: </Text>
                                    <Text style={tw`text-black`}>{(new Date(date_depart)).toLocaleString('fr-FR', {weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'})} à { heure_depart }</Text>
                                </View> */}

                                <View style={tw`flex-row mt-10 mb-5 justify-between border-b border-t border-gray-200 px-3 py-4`}>

                                    <View style={tw`flex-1 justify-between items-center`}>
                                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>{ nb_place } Passager(s)</Text>
                                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                                    </View>

                                    <Divider orientation='vertical' />

                                    <View style={tw`flex-1 justify-between items-center`}>
                                        <Text style={[tw`text-black font-bold text-center`, {fontFamily: polices.times_new_roman}]}>{ date_depart } { heure_depart }</Text>
                                        <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                                    </View>

                                    <Divider orientation='vertical' />

                                    <View style={tw`flex-1 justify-between items-center`}>
                                        <View style={[ tw`flex-row justify-center items-center` ]}>
                                            <Icon type='material-community' name='approximately-equal' containerStyle={[ tw`mr-1` ]} />
                                            <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Prix</Text>
                                        </View>
                                        {/* <Text style={tw`text-black font-bold`}>Prix</Text> */}
                                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{ getCurrency(mnt) } XOF</Text>
                                    </View>

                                </View>
                            </>
                        :
                            action == 'course' && (
                                <>
                                    <View style={tw`items-center mt-2`}>
                                        <Text style={[tw`text-black font-bold`,{fontFamily: polices.times_new_roman}]}>{ nb_place } Passager(s)</Text>
                                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                                    </View>

                                    <View style={[ tw`flex-row mt-10 mb-3 justify-center items-center border-t border-b border-slate-300 rounded-2xl py-1 px-3` ]}>
                                        <Icon type='material-community' name='approximately-equal' size={40} color={ColorsEncr.main} containerStyle={[ tw`mr-1` ]} />
                                        <Text style={[ tw`text-black text-lg font-bold`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(mnt) } XOF</Text>
                                    </View>
                                </>
                            )
                        }

                        {state == 0
                            ?
                                itemSelected !== null
                                ?
                                    <View style={[ tw`justify-center mt-3` ]}>
                                        <TouchableOpacity activeOpacity={0.5} onPress={onHandle} style={[ tw`justify-center items-center bg-neutral-50 rounded py-4 px-5 mb-2` ]}>
                                            <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.times_new_roman} ]}>Valider</Text>
                                        </TouchableOpacity>
        
                                        <TouchableOpacity activeOpacity={0.5} onPress={()=>setItemSelected(null)} style={tw`justify-center items-center bg-red-600 rounded py-4 px-5`}>
                                            <Text style={[ tw`uppercase text-center font-medium text-white`, {fontFamily: polices.times_new_roman} ]}>Annuler</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                <>
                                    <View style={tw`items-center mt-3`}>
                                        <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Recherche de Taxi...</Text>
                                        <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>
                                            {action == 'reservation'
                                            ?
                                                `Votre réservation a bien été enregistrée. Vous serez notifié sur les différentes étapes d'exécution de celle-ci`
                                            :
                                                `Veuillez patienter. Un taxi plus proche de vous acceptera votre course et se rendra au point de départ.`
                                            }
                                        </Text>
                                    </View>
                                    {annonces.length !== 0
                                    ?
                                        <Pubs annonces={annonces} containerStyle={{width: useWindowWidth - 98}} />
                                    :
                                        <View style={tw`flex-1 justify-center items-center py-10`}>
                                            <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                                        </View>
                                    }
                                </>
                            : state == 1
                                ?
                                    <View style={tw`items-center`}>
                                        <View style={tw`items-center my-3`}>
                                            <Image
                                                source={conducteur_img}
                                                style={[ tw`rounded-full border-2`, {width: 70, height: 70, borderColor: '#e4e4e4'}]}
                                            />
                                            <View style={tw`flex-row items-center`}>
                                                <Icon type="feather" name="phone" reverse size={12} color="#bbb" />
                                                <Text style={[tw`text-black text-base`, {fontFamily: polices.times_new_roman}]} onPress={() => callPhoneNumber(course.conducteur.tel)}>{course.conducteur.tel}</Text>
                                            </View>
                                        </View>
                                        <Text style={[tw`text-center text-black text-lg`, {fontFamily: polices.times_new_roman}]}>Un taxi a accepté votre course.</Text>
                                        {/* <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' /> */}
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Veuillez accéder à l'historique de vos courses, puis aux détails de votre course pour suivre les différents évènements relatifs à votre course.</Text>
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Merci.</Text>
                                    </View>
                                : state == 10
                                    ?
                                        <>
                                            <Text style={[tw`text-center text-black`, {fontFamily: polices.times_new_roman}]}>Course en cours...</Text>
                                            <View style={[tw`items-center mb-3`, {}]}>
                                                <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-fiat-500.gif')} style={[tw``, {width: 200, height: 100}]} />
                                            </View>
                                            <View style={tw`px-5`}>
                                                <Pressable
                                                    onPress={() => navigation.navigate('DashCurrentPosition', {course: course, category: action == 'course'?'ci':'' })}
                                                    style={[tw`flex-row justify-center items-center border rounded-lg p-3`, {borderColor: ColorsEncr.main}]}>
                                                    <Image
                                                        source={require('../../../assets/images/itineraire.png')}
                                                        style={{width: 30, height: 30 }} />
                                                    <Text style={[tw`ml-2 text-gray-500 text-base text-center`, {fontFamily: polices.times_new_roman}]}>Suivre la course</Text>
                                                </Pressable>
                                            </View>
                                        </>
                                    : state == 11
                                        ?
                                            <>
                                                <Text style={[tw`text-center font-black text-black mt-3`, {fontFamily: polices.times_new_roman}]}>Course Terminée</Text>
                                                <View style={[tw`items-center`, {}]}>
                                                    {/* <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-voiture.gif')} style={[tw``, {width: 200, height: 100}]} /> */}
                                                    <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                                                </View>
                                                <View style={tw`items-center mt-10`}>
                                                    <TouchableOpacity
                                                        onPress={() => navigation.navigate('DashFinition', {course: course, category: 'ci'})}
                                                        style={[ tw`bg-orange-100 rounded-2xl py-1 px-3`, {width: 150} ]}>
                                                        <Text style={[ tw`text-lg text-center font-bold`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>Facture</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        :
                                            <View style={tw`items-center mt-3`}>
                                                <Text style={[tw`text-center text-black text-lg`, {fontFamily: polices.times_new_roman}]}>[Timeout]: course annulée.</Text>
                                                <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                                                <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Veuillez accéder à l'historique de vos courses, puis aux détails de votre course pour suivre les différents évènements relatifs à votre course.</Text>
                                                <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Merci.</Text>
                                            </View>
                        }

                    </View>

                </ScrollView>

                <View style={[ tw`flex-row px-5 justify-center items-center`, {height: 90} ]}>
                    <RNDivider size={3} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                    <Pressable
                        onPress={goHome}
                        style={[ tw`justify-center items-center rounded-full border border-slate-900 mx-2`, {width: 70, height:70} ]}
                    >
                        <Icon type='entypo' name='home' color='rgb(15, 23, 42)' size={30} reverse />
                    </Pressable>
                    <RNDivider size={2} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                </View>

                {(action == 'course' && showBottomSheet && state == 0) && (
                    <RNBottomSheet ref={ref} maxHeight={height + 150}>
                            <View onLayout={(event) => {
                                        setHeight(event.nativeEvent.layout.height)
                            console.log('HHeight: ', event.nativeEvent.layout.height)
                        }} style={[ tw`flex-1 p-3 pb-15 border-t-0 border-slate-200`, {backgroundColor: '#ffffff'} ]}>
                                <GHScrollView nestedScrollEnabled>
                                    <BottomSheetRender data={typeVoitures} onSelect={onSelectedItem} itemSelected={itemSelected} text="Vous n'avez pas trouvé un chauffeur disponible ? Essayer avec d'autre type de voiture." textStyle={{ fontFamily: 'YatraOne-Regular' }} />
                                </GHScrollView>
                            </View>
                    </RNBottomSheet>
                )}
            </GestureHandlerRootView>

        </Base>
    )
}

export default CourseLoaderView;