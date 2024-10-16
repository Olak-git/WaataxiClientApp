import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { api_ref, apiv3, baseUri, fetchUri, getCurrency, getUser, toast } from '../../../functions/functions';
import Spinner from 'react-native-spinkit';
import { WtCar1 } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import FlashMessage from '../../../components/FlashMessage';
import { setReload } from '../../../feature/reload.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { getErrorResponse, getErrorsToString, openUrl } from '../../../functions/helperFunction';
import { GestureHandlerRootView, TouchableWithoutFeedback, ScrollView as GHScrollView, FlatList as GHFlatlist } from 'react-native-gesture-handler';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { BottomSheetRender } from '../../../components/BottomSheetRender';
import { RNPModal } from '../../../components/RNPModal';
import { Button } from 'react-native-paper';
import { CourseTimingOut } from '../../../components/CourseTimingOut';
import { polices } from '../../../data/data';
import { cancelInstantRace, getDriverRates, getModelCars, updateModelCar } from '../../../services/races';

const timer = require('react-native-timer');

interface DetailsCourseViewProps {
    navigation: any,
    route: any
}
const DetailsCourseView: React.FC<DetailsCourseViewProps> = (props) => {

    const ref = useRef<BottomSheetRefProps>(null);
    const dispatch = useDispatch();
    const {navigation, route} = props;
    const [course, setCourse] = useState<any>(route.params.course);
    const { conducteur } = course;

    const path = conducteur && conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');

    const user = useSelector((state: any) => state.user.data);
    const [rating, setRating] = useState(0);
    const reload = useSelector((state: any) => state.reload.value);

    const [refreshing, setRefreshing] = useState(false);

    const [height, setHeight] = useState(0);
    const [visible, setVisible] = useState(false);
    const [typeVoitures, setTypeVoitures] = useState<any>(route.params.types_voiture||[]);
    const [itemSelected, setItemSelected] = useState<number|null>(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false)

    // console.log('Course', course);

    const cancelCourse = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('cancel-course', null);
        formData.append('token', user.slug);
        formData.append('course', course.slug);

        // cancelInstantRace({ formData })
        //     .then(json => {
        //         if(json.success) {
        //             dispatch(setReload());
        //             setTimeout(() => {
        //                 navigation.goBack();
        //                 setVisible(false);
        //             }, 2000)
        //         } else {
        //             setVisible(false);
        //             const errors = json.errors;
        //             console.log(errors);
        //             toast('DANGER', getErrorsToString(errors), false)
        //         }
        //     })
        //     .finally(() => {
        //         setVisible(false);
        //     })

        fetch(apiv3 ? api_ref + '/cancel_instant_race.php' : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                dispatch(setReload());
                setTimeout(() => {
                    navigation.goBack();
                    setVisible(false);
                }, 2000)
            } else {
                setVisible(false);
                const errors = json.errors;
                console.log(errors);
                toast('DANGER', getErrorsToString(errors), false)
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('DetailsCourseView Error1: ', error)
            getErrorResponse(error)
        })
        .finally(() => {
            setVisible(false);
        })
    }

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        if(conducteur) {
            formData.append('data-user', conducteur.slug);
        } else {
            formData.append('data-user', null);
        }
        formData.append('token', user.slug);
        formData.append('course', course.slug);

        // getDriverRates({ formData })
        //     .then(json => {
        //         setRefreshing(false);
        //         if(json.success) {
        //             if(json.scores) {
        //                 setRating(json.scores);
        //             }
        //             if(json.course) {
        //                 // dispatch(setReload());
        //                 setCourse(json.course);
        //             }
        //         } else {
        //             const errors = json.errors;
        //             console.log(errors);
        //         }
        //     })
        //     .finally(() => {
        //         setRefreshing(false);
        //     })

        fetch(apiv3 ? api_ref + '/get_driver_rates.php' : fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setRefreshing(false);
            if(json.success) {
                if(json.scores) {
                    setRating(json.scores);
                }
                if(json.course) {
                    // dispatch(setReload());
                    setCourse(json.course);
                }
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            setRefreshing(false);
            console.log('DetailsCourseView Error2: ', error);
            getErrorResponse(error)
        })
        .finally(() => {
            setRefreshing(false);
        })
    }

    const onHandle = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('update-course', null);
        formData.append('token', user.slug);
        formData.append('key', course.slug);
        // @ts-ignore
        formData.append(`type_voiture`, typeVoitures[itemSelected].id);
        console.log('FormData: ', formData)

        // updateModelCar({ formData })
        //     .then(json => {
        //         setVisible(false);
        //         if(json.success) {
        //             toast('SUCCESS', 'Vous avez modifié le type de voiture pour votre course.')
        //             if(json.course) {
        //                 setCourse(json.course);
        //             }
        //             setItemSelected(null)
        //         } else {
        //             const errors = json.errors;
        //             toast('DANGER', getErrorsToString(errors), false)
        //             console.log(errors);
        //         }
        //     })
        //     .finally(() => {
        //         setVisible(false);
        //     });

        fetch(apiv3 ? api_ref + '/update_model_car.php' : fetchUri, {
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
                if(json.course) {
                    setCourse(json.course);
                }
                setItemSelected(null)
            } else {
                const errors = json.errors;
                toast('DANGER', getErrorsToString(errors), false)
                console.log(errors);
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('DetailsCourseView Error3: ', error)
            getErrorResponse(error)
        })
        .finally(() => {
            setVisible(false);
        });
    }

    const onSelectedItem = (index: number, frais_km: number) => {
        setItemSelected(index);
    }

    const getTypeVoitures = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        formData.append('type_voitures', null);

        // getModelCars({ formData })
        //     .then(json => {
        //         if(json.success) {
        //             setShowBottomSheet(true)
        //             setTypeVoitures([...json.types]);
        //         } else {
        //             const errors = json.errors;
        //             console.log(errors);
        //         }
        //     })
        //     .finally(()=>{
                
        //     })

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
                setShowBottomSheet(true)
                setTypeVoitures([...json.types]);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('DetailsCourseView Error4: ', error)
            getErrorResponse(error)
        })
        .finally(()=>{
                
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getDataUser();
    }

    useEffect(() => {
        timer.setInterval('dt-other-data', getDataUser, 5000);
        return () => {
            timer.clearInterval('dt-other-data')
        }
    }, [])

    useEffect(() => {
        if(conducteur) {
            getDataUser();
        }
    }, [reload])

    useEffect(() => {
        if(course.etat_course == 0) timer.setTimeout('course-loader-sheet', getTypeVoitures, 300000)
        return () => {
            if(timer.timeoutExists('course-loader-sheet')) timer.clearTimeout('course-loader-sheet')
        }
    }, [course.etat_course])
    
    return (
        <Base>
            <CourseTimingOut visible={course.etat_course == -1} goBack />

            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Détails / Course' />

            <GestureHandlerRootView style={[ tw`flex-1` ]}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
                contentContainerStyle={tw`pb-3`}
            >
                {/* icons8-found-user-100.png */}
                <View style={[ tw`flex-row border-b border-t border-gray-200 px-3 py-2`, {} ]}>
                    {conducteur
                    ?
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate('DashProfilConducteur', {conducteur: conducteur})} style={tw`rounded-full mr-2`}>
                            <Image
                                source={path}
                                style={[ tw`rounded-full border-2`, {width: 70, height: 70, borderColor: ColorsEncr.main}]}
                            />
                        </TouchableOpacity>

                        <View style={tw`flex-1 pt-1 justify-between`}>
                            <Text style={[tw`text-black`, {fontFamily:'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>{conducteur.nom.toUpperCase() + ' ' + conducteur.prenom}</Text>
                            <Text style={[tw`text-black`, {fontFamily:'Itim-Regular'}, {fontFamily: polices.times_new_roman}]} onPress={() => openUrl(`tel:${conducteur.tel}`)}>{conducteur.tel}</Text>
                        </View>

                        <Rating
                            readonly
                            startingValue={rating}
                            ratingCount={5}
                            imageSize={15}
                            ratingColor={ColorsEncr.main}
                            style={[tw``, {marginTop: 7.5}]}
                        />
                    </>
                    :
                    <>
                        <WtCar1 width={60} style={tw`mr-2`} />
                        <View style={tw`flex-1 pt-1 justify-between`}>
                            <Text style={[tw`text-black`, {fontFamily: polices.times_new_roman}]}>Waataxi Service</Text>
                        </View>
                    </>
                    }
                </View>

                <View style={tw`border-b border-gray-200 px-3 py-4`}>
                    <View style={[ tw`flex-row items-center mb-3` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color='rgb(22, 101, 52)' containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400`, {fontFamily: polices.times_new_roman} ]}>{course.adresse_depart}</Text>
                    </View>
                    <View style={[ tw`flex-row items-center` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color={ColorsEncr.main} containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400`, {fontFamily: polices.times_new_roman} ]}>{course.adresse_arrive}</Text>
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-5` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{course.nb_km_prov.toString().replace('.', ',')} km</Text>
                        </View>
                        {/* <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{'1h 45m'}</Text>
                        </View> */}
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>{course.nb_place} Passager(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <View style={[ tw`flex-row justify-center items-center` ]}>
                            {course.etat_course != 11 && (
                                <Icon type='material-community' name='approximately-equal' size={20} containerStyle={[ tw`mr-1` ]} />
                            )}
                            <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Prix</Text>
                        </View>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{getCurrency(course.prix)} XOF</Text>
                    </View>

                </View>

                <View style={tw`mt-10`}>
                {course.etat_course == 0
                ?
                    itemSelected !== null
                    ?
                        <View style={[ tw`justify-center mt-3 px-4` ]}>
                            <Text style={[tw`text-center mb-2 text-black`, {fontFamily: polices.times_new_roman}]}>Vous avez choisi un autre type de voiture. Veuillez confirmer.</Text>
                            <TouchableOpacity activeOpacity={0.5} onPress={onHandle} style={[ tw`justify-center items-center bg-neutral-50 rounded py-4 px-5 mb-2` ]}>
                                <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.font1}, {fontFamily: polices.times_new_roman} ]}>Valider</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5} onPress={()=>setItemSelected(null)} style={tw`justify-center items-center bg-red-600 rounded py-4 px-5`}>
                                <Text style={[ tw`uppercase text-center font-medium text-white`, {fontFamily: polices.font1}, {fontFamily: polices.times_new_roman} ]}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    :
                    <>
                        <View style={tw`items-center px-2`}>
                            <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Recherche de Taxi...</Text>
                            <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                            <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Veuillez patienter! Un taxi plus proche de vous acceptera votre course et se rendra au point de départ.</Text>
                        </View>
                        <View style={tw`flex-1 justify-center items-center py-10`}>
                            <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                        </View>
                        <View style={tw`px-5`}>
                            <TouchableOpacity
                                onPress={cancelCourse}
                                style={[tw`border rounded-lg p-3`, {borderColor: ColorsEncr.main}]}>
                                <Text style={[tw`text-gray-500 text-center`, {fontFamily: polices.font1}, {fontFamily: polices.times_new_roman}]}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                :
                    course.etat_course == 1
                    ?
                        <>
                            {course.suis_la == 0
                                ?
                                    <View style={tw`items-center`}>
                                        <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Votre taxi arrive.</Text>
                                        <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Votre taxi est déjà en route. Il vous rejoint sur le point de départ dans un instant.</Text>
                                    </View>
                                :
                                    <View style={tw`items-center`}>
                                        <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Votre taxi est arrivé.</Text>
                                        <Spinner isVisible={true} size={30} color={'green'} type='ThreeBounce' />
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Veuillez vous rendre sur le point de départ.</Text>
                                    </View>
                            }
                            <View style={[tw`items-center`, {}]}>
                                <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-voiture.gif')} style={[tw``, {width: 200, height: 100}]} />
                            </View>
                        </>
                    :
                        course.etat_course == 10
                        ?
                            <>
                                <Text style={[tw`text-center text-black text-lg`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Course en cours...</Text>
                                <View style={[tw`items-center mb-3`, {}]}>
                                    <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-fiat-500.gif')} style={[tw``, {width: 200, height: 100}]} />
                                </View>
                                <View style={tw`px-5`}>
                                    <Pressable
                                        onPress={() => navigation.navigate('DashCurrentPosition', {course: course, category: 'ci'})}
                                        style={[tw`flex-row justify-center items-center border rounded-lg p-3`, {borderColor: ColorsEncr.main}]}>
                                        <Image
                                            source={require('../../../assets/images/itineraire.png')}
                                            style={{width: 30, height: 30 }} />
                                        <Text style={[tw`ml-2 text-gray-500 text-base text-center`, {fontFamily: polices.font1}, {fontFamily: polices.times_new_roman}]}>Suivre la course</Text>
                                    </Pressable>
                                </View>
                            </>
                        :
                            <>
                                <Text style={[tw`text-center font-black text-black`, {fontFamily: polices.times_new_roman}]}>Course Terminée</Text>
                                <View style={[tw`items-center`, {}]}>
                                    {/* <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-voiture.gif')} style={[tw``, {width: 200, height: 100}]} /> */}
                                    <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                                </View>
                                <View style={tw`items-center mt-4`}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('DashFinition', {course: course, category: 'ci'})}
                                        style={[ tw`bg-orange-100 rounded-2xl py-1 px-3`, {width: 100} ]}>
                                        <Text style={[ tw`text-sm text-center font-bold`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>A payer</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                }
                </View>

            </ScrollView>
            {(course.etat_course == 0 && showBottomSheet) && (
                <RNBottomSheet ref={ref} maxHeight={height + 150}>
                        <View onLayout={(event) => {
                                    setHeight(event.nativeEvent.layout.height)
                        console.log('HHeight: ', event.nativeEvent.layout.height)
                    }} style={[ tw`flex-1 p-3 pb-15 border-t-0 border-slate-200`, {backgroundColor: '#ffffff'} ]}>
                            <GHScrollView nestedScrollEnabled>
                                <BottomSheetRender data={typeVoitures} onSelect={onSelectedItem} itemSelected={itemSelected} text="Vous n'avez pas trouvé un taxi, veuillez sélectionner un autre type de voiture." action='course' />
                            </GHScrollView>
                        </View>
                </RNBottomSheet>
            )}
            </GestureHandlerRootView>
        </Base>
    )

}

export default DetailsCourseView;