import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import BottomButton from '../../../components/BottomButton';
import { WtCar1 } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-spinkit';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setReload } from '../../../feature/reload.slice';
import { callPhoneNumber, openUrl } from '../../../functions/helperFunction';
import { CourseTimingOut } from '../../../components/CourseTimingOut';
import { polices } from '../../../data/data';

interface DetailsReservationViewProps {
    navigation: any,
    route: any
}
const DetailsReservationView: React.FC<DetailsReservationViewProps> = (props) => {

    const dispatch = useDispatch();
    
    const {navigation, route} = props;
    const [course, setCourse] = useState<any>(route.params.course);
    const {conducteur} = course;

    const path = conducteur && conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');

    const user = useSelector((state: any) => state.user.data);
    const [rating, setRating] = useState(0);
    const reload = useSelector((state: any) => state.reload.value);
    const [visible, setVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    
    // console.log('Course: ', course);

    const onCancel = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('cancel-course-reservation', null);
        formData.append('course', course.slug);
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
            if(json.success) {
                dispatch(setReload());
                setTimeout(() => {
                    setVisible(false);
                    navigation.goBack();
                }, 1000);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            setVisible(false);
            console.log('DetailsReservationView Error1: ', error);
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
        formData.append('reservation-course', course.slug);
        fetch(fetchUri, {
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
            console.log('DetailsReservationView Error2: ', error);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getDataUser();
    }

    useEffect(() => {
        const timer = setInterval(getDataUser, 5000);
        return () => {
            clearInterval(timer);
        }
    }, [])

    useEffect(() => {
        if(conducteur) {
            getDataUser();
        }
    }, [reload])
    
    return (
        <Base>
            <CourseTimingOut visible={course.etat_course == -1} goBack />
            
            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Détails / Réservation' />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
            >
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
                                <Text style={[tw`text-black`, {fontFamily:'Itim-Regular'}, {fontFamily: polices.times_new_roman}]} onPress={() => callPhoneNumber(conducteur.tel)}>{conducteur.tel}</Text>
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
                            <View style={tw`flex-1 pt-1`}>
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
                            {!course.nb_km_parcouru
                            ?
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            :
                                null
                            }
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{course.nb_km_parcouru ? course.nb_km_parcouru : course.nb_km_prov} km</Text>
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
                        <Text style={[tw`text-black font-bold text-center`, {fontFamily: polices.times_new_roman}]}>{ course.date_depart }</Text>
                        <Icon type='font-awesome-5' name='calendar-alt' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={[tw`text-black font-bold text-center`, {fontFamily: polices.times_new_roman}]}>{ course.heure_depart }</Text>
                        <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                    </View>

                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>{course.nb_place} Passager(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    {/* <View style={tw`flex-1 justify-between items-center`}>
                        <View style={[ tw`flex-row justify-center items-center` ]}>
                            <Icon type='material-community' name='approximately-equal' containerStyle={[ tw`mr-1` ]} />
                            <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Prix</Text>
                        </View>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{ getCurrency(course.prix) } XOF</Text>
                    </View> */}
                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>Prix</Text>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{getCurrency(course.prix)} XOF</Text>
                    </View>

                </View>


                <View style={tw`mt-10 mb-5`}>
                {course.etat_course == 0
                ?
                    <>
                        <View style={tw`items-center`}>
                            <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Recherche de Taxi...</Text>
                            <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                            <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Veuillez patienter! Un taxi plus proche de vous acceptera votre course et se rendra au point de départ au jour et heure indiquées.</Text>
                        </View>
                        <View style={tw`flex-1 justify-center items-center py-10`}>
                            <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                        </View>
                    </>
                :
                    course.etat_course == 1
                    ?
                        <View style={tw`items-center`}>
                            <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}, {fontFamily: polices.times_new_roman}]}>Réservation validée.</Text>
                            <Spinner isVisible={true} size={30} color={course.suis_la == 0 ? 'black' : 'green'} type='ThreeBounce' />
                            {course.suis_la == 0
                                ? <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Rendez-vous sur le point de départ au date et heure indiquées.</Text>
                                :  
                                <>
                                    <Text style={[tw`text-center text-gray-500`, {fontFamily: 'MontserratAlternates-SemiBold'}, {fontFamily: polices.times_new_roman}]}>Votre taxi est arrivé.</Text>
                                    <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]}>Rendez-vous sur le point de départ.</Text>
                                </>
                            }
                        </View>
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
                                        onPress={() => navigation.navigate('DashCurrentPosition', {course: course, category: 'reservation-course'})}
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
                                    <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                                </View>
                                <View style={tw`items-center mt-4`}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('DashFinition', {course: course, category: 'reservation-course'})}
                                        style={[ tw`bg-orange-100 rounded-2xl py-1 px-3`, {width: 100} ]}>
                                        <Text style={[ tw`text-sm text-center font-bold`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>A payer</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                }
                </View>

            </ScrollView>

            {course.etat_course == 0 && (
                <View style={[ tw`justify-center px-4 border-t border-gray-300`, {height: 60} ]}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={[ tw`justify-center items-center border rounded px-5`, {backgroundColor: ColorsEncr.main, height: 45, borderColor: ColorsEncr.main} ]}
                    >
                        <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.times_new_roman} ]}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Base>
    )

}

export default DetailsReservationView;