import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import SearchBar from '../../../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import BottomButton from '../../../components/BottomButton';
import RenderItemCourseInstantane from '../../../components/RenderItemCourseInstantane';
import HelpDial from '../../../components/HelpDial';
import { setRefreshCoursesInstantanees, setStopped } from '../../../feature/init.slice';
import { clearStoreCourses, setStoreCourseInstantanee } from '../../../feature/courses.slice';
import { RNSpinner } from '../../../components/RNSpinner';
import { useNavigation } from '@react-navigation/native';
import { polices } from '../../../data/data';

const timer = require('react-native-timer');

const Body: React.FC<{spinner?: boolean, refreshing: boolean, onRefresh: ()=>void, endFetch: boolean, courses: Array<any>, courseEmptyText: string, renderItem: any, refList: any}> = ({spinner, refreshing, onRefresh, endFetch, courses, courseEmptyText, renderItem, refList}) => {
    const navigation = useNavigation();

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
                initialNumToRender={courses.length - 1}
                keyboardDismissMode='none'
                ListEmptyComponent={ 
                    <View>
                        <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{ courseEmptyText }</Text>
                    </View>
                }
                data={courses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ref={refList}
                contentContainerStyle={[ tw`px-4 pt-2` ]}
            />

            {(courses.length == 0 && endFetch) && (
                <BottomButton reverse navigation={navigation} route='DashProgramItineraire' params={{action: 'course'}} title={'Faire une course'} containerStyle={tw`border-t-0`} titleStyle={{ fontFamily: 'MontserratAlternates-SemiBold' }} />
            )}
        </>
    )
}

interface HistoriqueCourseInstantanneeViewProps {
    navigation: any,
    route: any
}
const HistoriqueCourseInstantanneeView: React.FC<HistoriqueCourseInstantanneeViewProps> = ({ navigation, route }) => {

    const {history, headerTitle} = route.params

    const dispatch = useDispatch();
    
    const courses_instantanees = useSelector((state: any) => state.courses.instantanee);

    const reload = useSelector((state: any) => state.reload.value);

    const user = useSelector((state: any) => state.user.data);

    const refresh_ci = useSelector((state: any) => state.init.refresh_ci);

    const refList = useRef(null);

    const [refreshing, setRefreshing] = useState(false);

    const [masterCourses, setMasterCourses] = useState<any>(history ? [] : [...courses_instantanees]);

    const [courses, setCourses] = useState<any>(history ? [] : [...courses_instantanees]);

    const [courseEmptyText, setCourseEmptyText] = useState('Aucune course disponible dans votre historique.');

    const [search, setSearch] = useState<string>('');

    const [endFetch, setEndFetch] = useState(false);

    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);

    const [newCourseExist, setNewCourseExist] = useState(true)

    const getCourses = () => {
        if(!visible && refresh_ci) {
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('courses', null);
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
                    if(history) {
                        const _courses = [...json.courses]
                        const newCourses = _courses.filter(function (item: any) {
                            // Récupérer les courses terminées et/ou annulées
                            return item.etat_course == 11 || item.etat_course == -1
                        });

                        setMasterCourses([...newCourses]);
                        setCourses([...newCourses]);
                    } else {
                        const _courses = [...json.courses]
                        const newCourses = _courses.filter(function (item: any) {
                            // Récupérer les courses terminées
                            return item.etat_course != 11 && item.etat_course != -1
                        });

                        setMasterCourses([...newCourses]);
                        setCourses([...newCourses]);

                        dispatch(setStoreCourseInstantanee([...newCourses]))
                    }

                    setEndFetch(true);
                    // console.log('FINI')
                } else {
                    const errors = json.errors;
                    console.log(errors);
                }
            })
            .catch(error => console.log('HistoriqueCourseInstantanneeView Error: ', error))
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getCourses();
    }

    const filter = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterCourses.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.conducteur ? item.conducteur.nom + ' ' + item.conducteur.prenom : ''} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setCourseEmptyText('Aucun résultat trouvé');
            setCourses(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setCourseEmptyText('');
            setCourses(masterCourses);
            setSearch('');
            setLoading(false);
        }
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        return (
            <RenderItemCourseInstantane key={index.toString()} navigation={navigation} routeName='DashDetailsCourse' item={item} />
        )
    }

    const openTimer = () => {
        timer.setInterval('refresh-courses-i', getCourses, 5000)
    }
    const clearTimer = () => {
        if(timer.intervalExists('refresh-courses-i')) timer.clearInterval('refresh-courses-i')
    }
    DeviceEventEmitter.addListener("event.historiquecoursesinstantanees.opentimer", (eventData) => {
        openTimer();
    });
    DeviceEventEmitter.addListener("event.historiquecoursesinstantanees.cleartimer", (eventData) => {
        clearTimer();
    });

    useEffect(() => {
        openTimer()
        return () => {
            clearTimer()
        }
    }, [visible, refresh_ci])

    useEffect(() => {
        getCourses();
    }, [reload])

    useEffect(() => {
        if(!refresh_ci) dispatch(setRefreshCoursesInstantanees(true))
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle={headerTitle}
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
                            value={search}
                            showLoading={loading}
                            onChangeText={filter}
                            onEndEditing={() => setLoading(false)}
                        />
                    :
                        <View style={tw`flex-1 flex-row items-center justify-between`}>
                            <HeaderTitle headerTitle={headerTitle} />
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />

            {courses_instantanees.length != 0
                ?
                    <Body spinner refreshing={refreshing} onRefresh={onRefresh} endFetch={endFetch} courses={courses} courseEmptyText={courseEmptyText} renderItem={renderItem} refList={refList} />
                : endFetch
                    ?
                        <Body refreshing={refreshing} onRefresh={onRefresh} endFetch={endFetch} courses={courses} courseEmptyText={courseEmptyText} renderItem={renderItem} refList={refList} />
                    : 
                        <ActivityLoading />
            }
        </Base>
    )

}

export default HistoriqueCourseInstantanneeView;