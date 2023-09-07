import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Image, Platform, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { Divider, Icon } from '@rneui/base';
import { GestureHandlerRootView, FlatList as GHFlatList, RefreshControl as GHRefreshControl, ScrollView } from 'react-native-gesture-handler';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { RNDivider } from '../../../components/RNDivider';
import SearchBar from '../../../components/SearchBar';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { characters_exists, getLocalDate, getLocalTimeStr } from '../../../functions/helperFunction';
import RenderNewItemCourseCovoiturage from '../../../components/RenderNewItemCourseCovoiturage';
import RenderItemCourseCovoiturage from '../../../components/RenderItemCourseCovoiturage';
import { setStopped } from '../../../feature/init.slice';
import { setStoreCovoiturage, setStoreReservationCovoiturage } from '../../../feature/courses.slice';
import { RNSpinner } from '../../../components/RNSpinner';
import { useNavigation } from '@react-navigation/native';
import { polices } from '../../../data/data';

const timer = require('react-native-timer');

const Body: React.FC<{spinner?: boolean, reservation: any, onReservationRefresh: ()=>void, endFetch: boolean, renderReservationItem: any, setRefList: (a:any)=>void, refSheet: any, covoiturage: any, filterCovoituragesFunction: (a:string)=>void, onHandle: (a:any,b:string)=>void, onCovoiturageRefresh: ()=>void, renderNewItem: any, refreshing: boolean, onRefresh: ()=>void}> = ({spinner, reservation, onReservationRefresh, endFetch, renderReservationItem, setRefList, refSheet, covoiturage, filterCovoituragesFunction, onHandle, onCovoiturageRefresh, renderNewItem, refreshing, onRefresh}) => {
    const navigation = useNavigation();

    return (
        <GestureHandlerRootView style={[ tw`flex-1` ]}>
            {Platform.OS == 'android'
                ?
                    <>
                        {/*reservation.master.length >= 10 && (
                            <View style={tw`px-3 mb-3`}>
                                <SearchBar 
                                    iconSearchColor='grey'
                                    iconSearchSize={20}
                                    loadingColor='grey'
                                    containerStyle={[ tw`px-3 rounded-lg border-0 bg-gray-200` ]}
                                    inputContainerStyle={tw`border-b-0`}
                                    placeholder='Rechercher'
                                    value={reservation.search}
                                    showLoading={reservation.loading}
                                    onChangeText={filterReservationsFunction}
                                    onEndEditing={() => onHandle({loading: false}, 'reservation')}
                                />
                            </View>
                        )*/}
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    // progressBackgroundColor='white'
                                    colors={['red', 'blue', 'green']}
                                    refreshing={reservation.refreshing} 
                                    onRefresh={onReservationRefresh} />
                            }
                            ListHeaderComponent={spinner?<RNSpinner visible={!endFetch} />:undefined}
                            removeClippedSubviews={true}
                            initialNumToRender={reservation.data.length - 1}
                            keyboardDismissMode='none'
                            ListEmptyComponent={ 
                                <View>
                                    <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{reservation.empty}</Text>
                                </View>
                            }
                            data={reservation.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderReservationItem}
                            ref={(ref) => {
                                // @ts-ignore
                                setRefList(ref)
                            }}
                            contentContainerStyle={[ tw`px-4 pt-2 pb-10` ]}
                        />

                        <RNBottomSheet ref={refSheet} callAction={true}>
                            <View style={[ tw`flex-1 p-3 pb-15 border-t-0 border-slate-200`, {backgroundColor: '#ffffff'} ]}>
                                {covoiturage.master.length >= 10 && (
                                    <SearchBar 
                                        iconSearchColor='grey'
                                        iconSearchSize={20}
                                        containerStyle={[ tw`px-3 rounded-lg border-0 bg-gray-200` ]}
                                        inputContainerStyle={tw`border-b-0`}
                                        placeholder='Rechercher'
                                        value={covoiturage.search}
                                        onChangeText={filterCovoituragesFunction}
                                        showLoading={covoiturage.loading}
                                        onEndEditing={() => onHandle({loading: false}, 'covoiturage')}
                                    />
                                )}
                                <GHFlatList
                                    refreshControl={
                                        <GHRefreshControl
                                            colors={['red', 'blue', 'green']}
                                            refreshing={covoiturage.refreshing} 
                                            onRefresh={onCovoiturageRefresh} />
                                    }
                                    ListHeaderComponent={
                                        <>
                                            <View style={tw``}>
                                                <Text style={[ tw`text-black text-base text-center font-bold`, {fontFamily: polices.times_new_roman} ]}>Prochaines courses disponibles</Text>
                                                <View style={[ tw`items-center px-30` ]}>
                                                    <RNDivider size={2} color={'grey'} />
                                                </View>
                                            </View>
                                            {spinner && (<RNSpinner visible={!endFetch} />)}
                                        </>
                                    }
                                    removeClippedSubviews={true}
                                    initialNumToRender={covoiturage.data.length - 1}
                                    keyboardDismissMode='none'
                                    ListEmptyComponent={ 
                                        <View>
                                            <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{covoiturage.empty}</Text>
                                        </View>
                                    }
                                    data={covoiturage.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderNewItem}
                                    ref={(ref) => {
                                        // @ts-ignore
                                        setRefList(ref)
                                    }}
                                    contentContainerStyle={[ tw`pt-2` ]}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </RNBottomSheet>
                    </>
                :
                    <>
                        {/*<View style={tw`px-3 mb-3`}>
                            <SearchBar 
                                iconSearchColor='grey'
                                iconSearchSize={20}
                                loadingColor='grey'
                                containerStyle={[ tw`px-3 rounded-lg border-0 bg-gray-200` ]}
                                inputContainerStyle={tw`border-b-0`}
                                placeholder='Rechercher'
                                value={search}
                                showLoading={loading}
                                onChangeText={filterItemsFunction}
                                onEndEditing={() => setLoading(false)}
                            />
                        </View>*/}

                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    // progressBackgroundColor='white'
                                    colors={['red', 'blue', 'green']}
                                    refreshing={refreshing} 
                                    onRefresh={onRefresh} 
                                />
                            }
                            style={tw``}
                            contentContainerStyle={tw`px-4 pt-2 pb-10`}
                        >
                            {spinner && (<RNSpinner visible={!endFetch} />)}
                            {covoiturage.data.length == 0 && (
                                <View>
                                    <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{covoiturage.empty}</Text>
                                </View>
                            )}
                            {covoiturage.data.map((item: any, index: number) => <RenderNewItemCourseCovoiturage key={index.toString()} item={item} navigation={navigation} />)}

                            <View style={[ tw`flex-row items-center my-3`, {}]}>
                                <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                <Text style={[ tw`text-black text-xs font-bold px-4 py-1 border rounded-2xl`, {fontFamily: polices.times_new_roman} ]}>Historique</Text>
                                <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                            </View>

                            {spinner && (<RNSpinner visible={!endFetch} />)}
                            {reservation.data.length == 0 && (
                                <View>
                                    <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{reservation.empty}</Text>
                                </View>
                            )}
                            {reservation.data.map((item: any, index: number) => <RenderItemCourseCovoiturage key={index.toString()} item={item} navigation={navigation} />)}
                        </ScrollView>
                    </>
            }
        </GestureHandlerRootView>
    )
}

interface HistoriqueCovoiturageViewProps {
    navigation: any
}
const HistoriqueCovoiturageView: React.FC<HistoriqueCovoiturageViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const courses_covoiturages = useSelector((state: any) => state.courses.covoiturage);

    const courses_reservation_covoiturages = useSelector((state: any) => state.courses.reservation_covoiturage);
    
    const reload = useSelector((state: any) => state.reload.value);

    const user = useSelector((state: any) => state.user.data);

    const refSheet = useRef<BottomSheetRefProps>(null);

    const [refList, setRefList] = useState(null);

    const [reservation, setReservation] = useState({
        data: [...courses_reservation_covoiturages],
        master: [...courses_reservation_covoiturages],
        empty: 'Aucune réservation disponible dans votre historique',
        search: '',
        loading: false,
        refreshing: false
    });

    const [covoiturage, setCovoiturage] = useState({
        data: [...courses_covoiturages],
        master: [...courses_covoiturages],
        empty: 'Pas de prochaine course disponible',
        search: '',
        loading: false,
        refreshing: false
    });

    const [visible, setVisible] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const onHandle = (data: object, obj: string) => {
        if(obj == 'reservation') {
            setReservation(state => ({...state, ...data}));
        } else if(obj == 'covoiturage') {
            setCovoiturage(state => ({...state, ...data}));
        }
    }

    const getData = () => {
        if(!visible) {
            const formData = new FormData();
            formData.append('js', null);
            formData.append('covoiturages', null);
            formData.append('token', user.slug);
            // console.log(formData);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async json => {
                onHandle({refreshing: false}, 'reservation');
                onHandle({refreshing: false}, 'covoiturage');
                setRefreshing(false)
                // console.log(json)
                if(json.success) {
                    await onHandle({data: [...json.reservations], master: [...json.reservations]}, 'reservation');
                    await onHandle({data: [...json.covoiturages], master: [...json.covoiturages]}, 'covoiturage');

                    dispatch(setStoreCovoiturage([...json.covoiturages]))
                    dispatch(setStoreReservationCovoiturage([...json.reservations]))
                                        
                    setEndFetch(true);
                } else {
                    const errors = json.errors;
                    console.log(errors);
                }
            })
            .catch(error => console.log('HistoriqueCovoiturageView Error: ', error))
        }
    }

    const filterItemsFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData1 = reservation.master.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.covoiturage.conducteur.nom} ${item.covoiturage.conducteur.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();

                return characters_exists(textData, itemData)
                // return itemData.indexOf(textData) > -1;
            });

            const newData2 = covoiturage.master.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.conducteur.nom} ${item.conducteur.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();

                return characters_exists(textData, itemData)
                // return itemData.indexOf(textData) > -1;
            });
            setSearch(text);
            onHandle({empty: 'Aucun résultat trouvé', data: newData2, search: text}, 'covoiturage');
            onHandle({empty: 'Aucun résultat trouvé', data: newData1, search: text}, 'reservation');
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setSearch(text);
            setLoading(false);
            onHandle({empty: 'Aucune réservation disponible dans votre historique', data: reservation.master, search: text, loading: false}, 'reservation');
            onHandle({empty: 'Pas de prochaine course disponible', data: covoiturage.master, search: text, loading: false}, 'covoiturage');
        }
    }

    const filterReservationsFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            onHandle({loading: true}, 'reservation');
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = reservation.master.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.covoiturage.conducteur.nom} ${item.covoiturage.conducteur.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();

                return characters_exists(textData, itemData)
                // return itemData.indexOf(textData) > -1;
            });
            onHandle({empty: 'Aucun résultat trouvé', data: newData, search: text}, 'reservation');
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            onHandle({empty: 'Aucune réservation disponible dans votre historique', data: reservation.master, search: text, loading: false}, 'reservation');
        }
    }

    const filterCovoituragesFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            onHandle({loading: true}, 'covoiturage');
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = covoiturage.master.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.conducteur.nom} ${item.conducteur.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();

                return characters_exists(textData, itemData)
                // return itemData.indexOf(textData) > -1;
            });
            onHandle({empty: 'Aucun résultat trouvé', data: newData, search: text}, 'covoiturage');
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            onHandle({empty: 'Pas de prochaine course disponible', data: covoiturage.master, search: text, loading: false}, 'covoiturage');
        }
    }

    const onReservationRefresh = () => {
        onHandle({refreshing: true}, 'reservation');
        getData();
    }

    const onCovoiturageRefresh = () => {
        onHandle({refreshing: true}, 'covoiturage');
        getData();
    }

    const onRefresh = () => {
        setRefreshing(true)
        getData();
    }

    // @ts-ignore
    const renderNewItem = ({item, index}) => {
        return (
            <RenderNewItemCourseCovoiturage key={index.toString()} item={item} navigation={navigation} />
        )
    }

    // @ts-ignore
    const renderReservationItem = ({item, index}) => {
        return (
            <RenderItemCourseCovoiturage key={index.toString()} item={item} navigation={navigation} />
        )
    }

    const onShowBottomSheet = useCallback(() => {
        // @ts-ignore
        const isActive = refSheet?.current?.isActive();
        if(isActive) {
            // @ts-ignore
            refSheet?.current?.scrollTo(0);
        } else {
            // @ts-ignore
            refSheet?.current?.scrollTo(-200);
        }
    }, []);

    const openTimer = () => {
        timer.setInterval('refresh-courses-covoiturage', getData, 5000)
    }
    const clearTimer = () => {
        if(timer.intervalExists('refresh-courses-covoiturage')) timer.clearInterval('refresh-courses-covoiturage')
    }
    const event1 = DeviceEventEmitter.addListener("event.historiquecovoiturages.opentimer", (eventData) => {
        openTimer();
    });
    const event2 = DeviceEventEmitter.addListener("event.historiquecovoiturages.cleartimer", (eventData) => {
        clearTimer();
    });

    useEffect(() => {
        return () => {
            event1.remove()
            event2.remove()
        }
    }, [])

    useEffect(() => {
        openTimer()
        return () => {
            clearTimer();
        }
    }, [visible])

    useEffect(() => {
        if(reservation.search || covoiturage.search) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [reservation, covoiturage])

    useEffect(() => {
        getData();
    }, [reload])

    useEffect(() => {
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])

    // useEffect(() => {
    //     dispatch(setStoreReservationCovoiturage([]))
    // }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Covoiturages' content={
                <View style={tw`flex-1 flex-row items-center justify-between`}>
                    <HeaderTitle headerTitle='Covoiturages' />
                    {(Platform.OS == 'android' && endFetch) && (
                        <Pressable
                            onPress={onShowBottomSheet}
                        >
                            <Image source={require('../../../assets/images/settings-2.png')} style={{width: 30, height: 30}} />
                        </Pressable>
                    )}
                </View>
            } />

            {courses_covoiturages.length != 0 || courses_reservation_covoiturages.length != 0
                ? 
                    <Body spinner reservation={reservation} onReservationRefresh={onReservationRefresh} endFetch={endFetch} renderReservationItem={renderReservationItem} setRefList={setRefList} refSheet={refSheet} covoiturage={covoiturage} filterCovoituragesFunction={filterCovoituragesFunction} onHandle={onHandle} onCovoiturageRefresh={onCovoiturageRefresh} renderNewItem={renderNewItem} refreshing={refreshing} onRefresh={onRefresh} />
                : endFetch
                    ?
                        <Body reservation={reservation} onReservationRefresh={onReservationRefresh} endFetch={endFetch} renderReservationItem={renderReservationItem} setRefList={setRefList} refSheet={refSheet} covoiturage={covoiturage} filterCovoituragesFunction={filterCovoituragesFunction} onHandle={onHandle} onCovoiturageRefresh={onCovoiturageRefresh} renderNewItem={renderNewItem} refreshing={refreshing} onRefresh={onRefresh} />
                    :
                        <ActivityLoading />
                    
            }
        </Base>
    )
}

export default HistoriqueCovoiturageView;