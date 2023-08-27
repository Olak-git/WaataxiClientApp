import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { Rating } from 'react-native-ratings';
import Spinner from 'react-native-spinkit';
import { callPhoneNumber, getLocalTimeStr, openUrl } from '../../../functions/helperFunction';
import BottomButton from '../../../components/BottomButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../feature/user.slice';
import { ActivityIndicator } from 'react-native-paper';

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

interface DetailsNewCovoiturageViewProps {
    navigation: any,
    route: any
}
const DetailsNewCovoiturageView: React.FC<DetailsNewCovoiturageViewProps> = (props) => {

    const dispatch = useDispatch();
    const {navigation, route} = props;
    const [course, setCourse] = useState<any>(route.params.course);
    const { valide } = route.params;
    const {conducteur} = course;

    const path = conducteur && conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');

    const user = useSelector((state: any) => state.user.data);
    const [rating, setRating] = useState(0);
    const reload = useSelector((state: any) => state.reload.value);
    const [refreshing, setRefreshing] = useState(false);
    const [configuration, setConfiguration] = useState({});

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('data-user', conducteur.slug);
        formData.append('token', user.slug);
        formData.append('covoiturage', course.slug);
        formData.append('e-configuration', null);
        
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
            console.log('JSON: ', json);
            if(json.success) {
                if(json.scores) {
                    setRating(json.scores);
                }
                if(json.course) {
                    // dispatch(setReload());
                    setCourse(json.course);
                }
                setConfiguration(state => ({...state, ...json.configuration}));
                dispatch(setUser({portefeuille: json.user.portefeuille}));
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('DetailsNewCovoiturageView Error: ', error);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getDataUser();
    }

    useEffect(() => {
        getDataUser();
    }, [reload])
    
    return (
        <Base>
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
                        <Text style={tw`text-black`}>{conducteur.nom.toUpperCase() + ' ' + conducteur.prenom}</Text>
                        <Text style={tw`text-black`} onPress={() => callPhoneNumber(conducteur.tel)}>{conducteur.tel}</Text>
                    </View>
                    <Rating
                        readonly
                        startingValue={rating}
                        ratingCount={5}
                        imageSize={15}
                        ratingColor={ColorsEncr.main}
                        style={[tw``, {marginTop: 7.5}]}
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
                        <Text style={tw`text-black font-bold`}>{ course.date_course}</Text>
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                        <Text style={tw`text-black font-bold`}>{getLocalTimeStr(course.heure_course)}</Text>
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>{course.nb_place_restante} Place(s) disponible(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>Prix</Text>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main} ]}>{getCurrency(course.mnt)} XOF</Text>
                    </View>

                </View>

            </ScrollView>

            {parseInt(course.nb_place_restante) > 0 && (
                <>
                {Object.keys(configuration).length == 0
                ?
                    <View style={tw`py-3`}>
                        <ActivityIndicator color='#cccccc' />
                    </View>
                : 
                    // @ts-ignore
                    parseInt(user.portefeuille) < ((course.mnt * configuration.commission_covoiturage) / 100)
                    ?
                        <View style={tw`bg-slate-900 rounded-lg p-3 mx-1 mb-1`}>
                            <Text style={tw`text-white`}>Veuillez recharger votre portefeuille pour réserver une place.</Text>
                        </View>
                    :
                        <BottomButton reverse title='Réserver une place' navigation={navigation} route='DashProgramCovoiturage' params={{course: course}} />
                }
                </>
            )}

        </Base>
    )
}

export default DetailsNewCovoiturageView;