import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';
import { fetchUri, getCurrency, windowHeight, windowWidth } from '../../../functions/functions';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { polices } from '../../../data/data';

const timer = require('react-native-timer');

interface CovoiturageReservationLoaderViewProps {
    navigation: any,
    route: any
}
const CovoiturageReservationLoaderView: React.FC<CovoiturageReservationLoaderViewProps> = ({ navigation, route }) => {

    const user = useSelector((state: any) => state.user.data);
    
    const { slug, adresse_depart, adresse_arrive, nb_km, duration, prix, nb_place } = route.params;

    const [course, setCourse] = useState<any>({
        slug: slug,
        adresse_depart: adresse_depart,
        adresse_arrive: adresse_arrive,
        nb_km: nb_km,
        nb_place: nb_place,
        prix: prix,
        etat_course: 0
    });

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const goHome = () => {
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
        formData.append('reservation-covoiturage', course.slug);
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
                    setCourse((prev: any) => ({...course, ...json.course}))
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

    useEffect(()=>{
        timer.setInterval('course-covoiturage-loader-data', getData, 2000)
        return ()=>{
            if(timer.intervalExists('course-covoiturage-loader-data')) timer.clearInterval('course-covoiturage-loader-data')
        }
    },[])
    
    return (
        <Base>

            <ScrollView contentContainerStyle={tw`pb-4`}>

                <View style={[ tw`bg-white pt-8 px-5` ]}>

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

                    <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{course.nb_km}</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='material-community' name='clock' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs ml-1`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{duration}</Text>
                        </View>
                    </View>

                    <View style={tw`items-center mt-2`}>
                        <Text style={[tw`text-black font-bold`, {fontFamily: polices.times_new_roman}]}>{ nb_place } Passager(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <View style={[ tw`flex-row mt-10 mb-3 justify-center items-center border-t border-b border-slate-300 rounded-2xl py-1 px-3` ]}>
                        <Icon type='material-community' name='approximately-equal' size={40} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                        <Text style={[ tw`text-black text-lg font-bold`, {fontFamily: polices.times_new_roman} ]}>{ getCurrency(course.prix) } XOF</Text>
                    </View>

                    {course.etat_course == 0
                        ?
                            <>
                            <View style={tw`items-center`}>
                                <Text style={[tw`text-center text-black text-lg`, {fontFamily: polices.times_new_roman}]}>Veuillez patienter</Text>
                                <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                                <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Soyez à l'heure au point de départ pour ne pas manquer votre taxi.</Text>
                                <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Cependant, vous pouvez toujours manquer votre taxi si votre itinéraire n'est pas sur l'axe définit par le chauffeur.</Text>
                            </View>
                            <View style={tw`flex-1 justify-center items-center py-10`}>
                                <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                            </View>
                            </>
                        :
                            course.etat_course == 1
                            ?
                                <>
                                    <Text style={[tw`text-center text-black mt-4`, {fontFamily: polices.times_new_roman}]}>Course en cours...</Text>
                                    <View style={[tw`items-center mb-3`, {}]}>
                                        <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-fiat-500.gif')} style={[tw``, {width: 200, height: 100}]} />
                                    </View>
                                    <View style={tw`items-center`}>
                                        {/* <Text style={tw`text-center text-black text-lg`}>Votre taxi arrive.</Text> */}
                                        {/* <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' /> */}
                                        <Text style={[tw`text-center text-gray-500 mb-3`, {fontFamily: polices.times_new_roman}]}>Votre taxi est déjà en route. Soyez à l'heure sur le point de départ.</Text>
                                    </View>
                                </>
                            :
                            course.etat_course == 10
                            ?
                                <>
                                    <Text style={[tw`text-center font-black text-black mt-4`, {fontFamily: polices.times_new_roman}]}>Course Terminée</Text>
                                    <View style={[tw`items-center mb-3`, {}]}>
                                        <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                                    </View>
                                </>
                            :
                                null
                    }

                </View>

            </ScrollView>

            <View style={[ tw`flex-row px-5 justify-center items-center`, {height: 90} ]}>
                <RNDivider size={3} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                <Pressable
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
                </Pressable>
                <RNDivider size={2} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
            </View>

        </Base>
    )
}

export default CovoiturageReservationLoaderView;