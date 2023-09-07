import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';
import SearchBar from '../../../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import BottomButton from '../../../components/BottomButton';
import { WtCar1 } from '../../../assets';
import { setUser } from '../../../feature/user.slice';
import RenderItemCourseInstantane from '../../../components/RenderItemCourseInstantane';
import { setRefreshReservations, setStopped } from '../../../feature/init.slice';
import { setStoreReservation } from '../../../feature/courses.slice';
import { RNSpinner } from '../../../components/RNSpinner';
import { useNavigation } from '@react-navigation/native';
import { polices } from '../../../data/data';
import { characters_exists } from '../../../functions/helperFunction';

const timer = require('react-native-timer');

const Body: React.FC<{spinner?: boolean, refreshing: boolean, onRefresh: ()=>void, endFetch: boolean, reservations: any, reservationEmptyText: string, renderItem: any, refList: any, minTarif: any}> = ({spinner, refreshing, onRefresh, endFetch, reservations, reservationEmptyText, renderItem, refList, minTarif}) => {
    const user = useSelector((state: any) => state.user.data);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('portefeuille: ', user.portefeuille);
        console.log('minTarif: ', minTarif);
    }, [minTarif])

    return (
        <>
            <FlatList
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
                ListHeaderComponent={spinner?<RNSpinner visible={!endFetch} />:undefined}
                removeClippedSubviews={true}
                initialNumToRender={reservations.length - 1}
                keyboardDismissMode='none'
                ListEmptyComponent={ 
                    <View>
                        <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{ reservationEmptyText }</Text>
                    </View>
                }
                data={reservations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ref={refList}
                contentContainerStyle={[ tw`px-4 pt-2 pb-10` ]}
            />

            {parseInt(user.portefeuille) < minTarif
                ?
                    <View style={tw`bg-slate-900 rounded-lg p-3 mx-1 mb-1`}>
                        <Text style={[tw`text-white`, {fontFamily: polices.times_new_roman}]}>Compte insuffisant. Veuillez recharger votre portefeuille pour faire une réservation de course.</Text>
                    </View>
                :
                    <BottomButton reverse navigation={navigation} route='DashProgramItineraire' params={{action: 'reservation'}} title='Faire une réservation' containerStyle={[tw`border-t-0`]} titleStyle={{ fontFamily: 'MontserratAlternates-SemiBold' }} />
            }
        </>
    )
}

interface HistoriqueReservationViewProps {
    navigation: any
}
const HistoriqueReservationView: React.FC<HistoriqueReservationViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const courses_reservations = useSelector((state: any) => state.courses.reservation);

    const refresh_cr = useSelector((state: any) => state.init.refresh_cr);

    const reload = useSelector((state: any) => state.reload.value);

    const user = useSelector((state: any) => state.user.data);

    const refList = useRef(null);

    const [reservations, setReservations] = useState<any>([...courses_reservations]);
    const [masterReservations, setMasterReservations] = useState<any>([...courses_reservations]);
    const [reservationEmptyText, setReservationEmptyText] = useState('Aucune réservation disponibles dans votre historique');
    const [searchItem, setSearchItem] = useState('');
    const [endFetch, setEndFetch] = useState(false);
    const [minTarif, setMinTarif] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const getReservations = () => {
        if(!visible && refresh_cr) {
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('reservations-course', null);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async json => {
                setRefreshing(false);
                if(json.success) {
                    await setMasterReservations([...json.reservations]);
                    await setReservations([...json.reservations]);
                    // console.log('json.min_tarif: ', json.min_tarif);
                    setMinTarif(json.min_tarif);
                    dispatch(setUser({portefeuille: json.user.portefeuille}));

                    dispatch(setStoreReservation([...json.reservations]))

                    setEndFetch(true);
                } else {
                    const errors = json.errors;
                    console.log(errors);
                }
            })
            .catch(error => console.log('HistoriqueReservationView Error: ', error))
        }
    }

    const filterItemFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterReservations.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.conducteur ? item.conducteur.nom + ' ' + item.conducteur.prenom : ''} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();

                return characters_exists(textData, itemData)
                // return itemData.indexOf(textData) > -1;
            });
            setReservationEmptyText(`Aucun résultat trouvé pour "${text}"`);
            setReservations(newData);
            setSearchItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setReservations(masterReservations);
            setSearchItem(text);
            setReservationEmptyText('Aucune discussion');
            setLoading(false);
        }
    }

    const onRefresh = () => {
        if(!refresh_cr) dispatch(setRefreshReservations(true))
        setRefreshing(true);
        getReservations();
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        return (
            <RenderItemCourseInstantane key={index.toString()} reservation navigation={navigation} routeName='DashDetailsReservation' item={item} />
        )      
    }

    const openTimer = () => {
        timer.setInterval('historique-reservations', getReservations, 5000)
    }
    const clearTimer = () => {
        if(timer.intervalExists('historique-reservations')) timer.clearInterval('historique-reservations')
    }
    const event1 = DeviceEventEmitter.addListener("event.reservations.opentimer", (eventData) => {
        openTimer();
    });
    const event2 = DeviceEventEmitter.addListener("event.reservations.cleartimer", (eventData) => {
        clearTimer();
    });

    useEffect(() => {
        return () => {
            event1.remove()
            event2.remove()
        }
    }, [])

    useEffect(() => {
        openTimer();
        return () => {
            clearTimer();
        }
    }, [visible, refresh_cr])

    useEffect(() => {
        getReservations();
    }, [reload])

    useEffect(() => {
        if(!refresh_cr) dispatch(setRefreshReservations(true))
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])

    // useEffect(() => {
    //     console.log('courses_reservations: ', courses_reservations)
    // }, [courses_reservations])
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle='Historique Réservation'
                contentLeft={
                    visible
                    ?
                        <Pressable onPress={() => setVisible(false)}>
                            <Icon
                                type='ant-design'
                                name='arrowleft'
                                size={30} />
                        </Pressable>
                    :
                        undefined
                } 
                content={
                    visible
                    ?
                        <SearchBar 
                            iconSearchColor='grey'
                            iconSearchSize={20}
                            loadingColor='grey'
                            containerStyle={[ tw`flex-1 px-3 rounded-lg border-0 bg-gray-200` ]}
                            inputContainerStyle={tw`border-b-0`}
                            placeholder='Rechercher'
                            value={searchItem}
                            showLoading={loading}
                            onChangeText={filterItemFunction}
                            onEndEditing={() => setLoading(false)}
                        />
                    :
                        <View style={tw`flex-1 flex-row items-center justify-between`}>
                            <HeaderTitle headerTitle='Historique Réservation' />
                            <Text style={tw`px-4 text-lg text-black`}></Text>
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />

            {courses_reservations.length != 0
                ? 
                    <Body spinner refreshing={refreshing} onRefresh={onRefresh} endFetch={endFetch} reservations={reservations} reservationEmptyText={reservationEmptyText} renderItem={renderItem} refList={refList} minTarif={minTarif} />
                : endFetch
                    ?
                        <Body refreshing={refreshing} onRefresh={onRefresh} endFetch={endFetch} reservations={reservations} reservationEmptyText={reservationEmptyText} renderItem={renderItem} refList={refList} minTarif={minTarif} />
                    :
                        <ActivityLoading />
                    
            }
        </Base>
    )

}

export default HistoriqueReservationView;