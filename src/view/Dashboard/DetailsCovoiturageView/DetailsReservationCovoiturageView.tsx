import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-spinkit';
import { openUrl } from '../../../functions/helperFunction';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setReload } from '../../../feature/reload.slice';
import { polices } from '../../../data/data';

interface RowProps {
    iconType: string,
    iconName: string,
    iconSize?: number,
    textStyle?: any,
    text: string,
    _text?: React.ReactElement
}
const Row: React.FC<RowProps> = ({ iconType, iconName, iconSize = 30, textStyle = [], text, _text }) => {
    return (
        <View style={[ tw`flex-row items-center mb-3` ]}>
            <View style={[ tw``, {width: 50} ]}>
                <Icon
                    type={iconType}
                    name={iconName}
                    color='#666'
                    size={iconSize} />
            </View>
            <Text style={[ tw`text-gray-600 font-semibold text-lg mx-2` ]}>:</Text>
            <View style={[ tw`flex-1` ]}>
                <Text style={[ tw`text-black font-medium text-lg`, ...textStyle ]}>{ text }{_text}</Text>
            </View>
        </View>
    )
}

interface DetailsReservationCovoiturageViewProps {
    navigation: any,
    route: any
}
const DetailsReservationCovoiturageView: React.FC<DetailsReservationCovoiturageViewProps> = (props) => {

    const dispatch = useDispatch();
    const {navigation, route} = props;
    const [course, setCourse] = useState<any>(route.params.course);
    const {covoiturage} = course;
    const {conducteur} = covoiturage;

    const path = conducteur && conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');

    const user = useSelector((state: any) => state.user.data);
    const [rating, setRating] = useState(0);
    const reload = useSelector((state: any) => state.reload.value);
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onCancel = () => {
        setVisible(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('cancel-covoiturage-reservation', null);
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
            console.log('DetailsReservationCovoiturageView Error1: ', error);
        })
    }

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('data-user', conducteur.slug);
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
            console.log('DetailsReservationCovoiturageView Error2: ', error);
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
        getDataUser();
    }, [reload])
    
    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Détails' />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
                contentContainerStyle={tw`pb-3`}
            >
                <View style={[ tw`flex-row border-b border-t border-gray-200 px-3 py-2`, {} ]}>
                    <TouchableOpacity onPress={() => navigation.navigate('DashProfilConducteur', {conducteur: conducteur})} style={tw`rounded-full mr-2`}>
                        <Image
                            source={path}
                            style={[ tw`rounded-full border-2`, {width: 70, height: 70, borderColor: ColorsEncr.main}]}
                        />
                    </TouchableOpacity>
                    <View style={tw`flex-1 pt-1 justify-between`}>
                        <Text style={[tw`text-black`, {fontFamily:'Itim-Regular'}]}>{conducteur.nom.toUpperCase() + ' ' + conducteur.prenom}</Text>
                        <Text style={[tw`text-black`, {fontFamily:'Itim-Regular'}]} onPress={() => openUrl(`tel:${conducteur.tel}`)}>{conducteur.tel}</Text>
                    </View>
                    <Rating
                        readonly
                        startingValue={rating}
                        ratingCount={5}
                        imageSize={15}
                        ratingColor={ColorsEncr.main}
                        style={[tw``, {marginTop: 7.5}]}
                        type='star'
                    />
                </View>

                <View style={tw`border-b border-gray-200 px-3 py-4`}>
                    <View style={[ tw`flex-row items-center mb-3` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color='green' containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400` ]}>{course.adresse_depart}</Text>
                    </View>
                    <View style={[ tw`flex-row items-center` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color={ColorsEncr.main} containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400` ]}>{course.adresse_arrive}</Text>
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-5` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{course.nb_km} km</Text>
                        </View>
                        {/* <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{'1h 45m'}</Text>
                        </View> */}
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>
                    <View style={tw`flex-1 justify-between items-center`}>
                        <Icon type='font-awesome-5' name='calendar-alt' color={ColorsEncr.main} />
                        <Text style={tw`text-black font-bold`}>{ covoiturage.date_course}</Text>
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                        <Text style={tw`text-black font-bold`}>{ covoiturage.heure_course}</Text>
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>{course.nb_place} Passager(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>Prix</Text>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main} ]}>{getCurrency(course.prix)} XOF</Text>
                    </View>

                </View>

                <View style={tw`mt-10`}>
                    {course.etat_course == 0
                    ?
                        <>
                            <View style={tw`items-center`}>
                                <Text style={[tw`text-center text-black text-xl`, {fontFamily: 'Itim-Regular'}]}>En attente de votre Taxi...</Text>
                                <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                                {/* <Text style={tw`text-center text-gray-500 mb-3`}>Veuillez patienter! Un taxi plus proche de vous acceptera votre course et se rendra au point de départ.</Text> */}
                            </View>
                            <View style={tw`flex-1 justify-center items-center py-10`}>
                                <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                            </View>
                        </>
                    :
                        course.etat_course == 1
                        ?
                            <>
                                <Text style={[tw`text-center text-black text-lg`, {fontFamily: 'Itim-Regular'}]}>Course en cours...</Text>
                                <View style={[tw`items-center mb-3`, {}]}>
                                    <Image resizeMode='contain' source={require('../../../assets/images/gifs/icons8-fiat-500.gif')} style={[tw``, {width: 200, height: 100}]} />
                                </View>
                                <View style={tw`items-center`}>
                                    {/* <Text style={tw`text-center text-black text-lg`}>Votre taxi arrive.</Text> */}
                                    {/* <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' /> */}
                                    <Text style={tw`text-center text-gray-500 mb-3`}>Votre taxi est déjà en route. Soyez à l'heure sur le point de départ.</Text>
                                </View>
                            </>
                        :
                            course.etat_course == 10
                            ?
                                <>
                                    <Text style={tw`text-center font-black text-black`}>Course Terminée</Text>
                                    <View style={[tw`items-center mb-3`, {}]}>
                                        <Image resizeMode='contain' source={require('../../../assets/images/icons8-taxi-stop-100.png')} style={[tw``, {width: 200, height: 100}]} />
                                    </View>
                                    {/* <View style={tw`px-5`}>
                                        <Pressable
                                            onPress={() => navigation.navigate('DashCurrentPosition', {course: course, category: 'reservation-covoiturage'})}
                                            style={[tw`flex-row justify-center items-center border rounded-lg p-3`, {borderColor: ColorsEncr.main}]}>
                                            <Image
                                                source={require('../../../assets/images/itineraire.png')}
                                                style={{width: 30, height: 30 }} />
                                            <Text style={tw`ml-2 text-gray-500 text-base text-center`}>Suivre la course</Text>
                                        </Pressable>
                                    </View> */}
                                </>
                            :
                                null
                    }
                </View>

            </ScrollView>

            {course.etat_course == 0 && (
                <View style={[ tw`justify-center px-4 border-t border-gray-300`, {height: 60} ]}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={[ tw`justify-center items-center border rounded px-5`, {backgroundColor: ColorsEncr.main, height: 45, borderColor: ColorsEncr.main} ]}
                    >
                        <Text style={[ tw`uppercase text-center font-medium text-black`, {fontFamily: polices.font1} ]}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}

        </Base>
    )

}

export default DetailsReservationCovoiturageView;