import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { WtCar1 } from '../../../assets';
import { Icon } from '@rneui/themed';
import { getLocalDate, getLocalTime } from '../../../functions/helperFunction';
import SearchBar from '../../../components/SearchBar';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { addNotification } from '../../../feature/notifications.slice';
import { Divider } from '@rneui/base';
import { polices } from '../../../data/data';

interface NotificationsViewProps {
    navigation: any
}
const NotificationsView: React.FC<NotificationsViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const notifies = useSelector((state: any) => state.notifications.data);

    const user = useSelector((state: any) => state.user.data);

    const reload = useSelector((state: any) => state.reload.value);

    const [refList, setRefList] = useState(null);

    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notificationEmptyText, setNotificationEmptyText] = useState('Aucune notification disponible pour le moment.');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [endFetch, setEndFetch] = useState(false);

    const [masterNotifications, setMasterNotifications] = useState<any>([]);
    const [notifications, setNotifications] = useState<any>([]);

    const getNotifications = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        formData.append('notifications', null);
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
                console.log(json);
                setNotifications([...json.notifications]);
                setMasterNotifications([...json.notifications]);
                setEndFetch(true);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('NotificationsView Error: ', error)
            setRefreshing(false);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getNotifications();
    }

    const filter = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterNotifications.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.intituler} ${item.dat}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setNotificationEmptyText('Aucun résultat trouvé');
            setNotifications(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setNotificationEmptyText('Aucune notification disponible pour le moment.');
            setNotifications(masterNotifications);
            setSearch('');
            setLoading(false);
        }
    }

    const onHandle = (item: any) => {
        dispatch(addNotification(item.id));
        navigation.navigate('DashDetailsNotification', {notification: item});
    }

    // @ts-ignore
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => onHandle(item)}
                style={[ tw`flex-row mb-3` ]}>
                <Icon type='font-awesome' color={ColorsEncr.main} size={18} reverse reverseColor={notifies.indexOf(item.id) === -1 ? '#000000' : '#FFFFFF'} name={notifies.indexOf(item.id) === -1 ? 'envelope' : 'envelope-open'} />
                <View style={tw`ml-3 flex-1`}>
                    <Text style={[tw`${notifies.indexOf(item.id) === -1 ? 'font-black text-black' : 'font-bold text-gray-600'}`, {fontFamily: 'YatraOne-Regular'}, {fontFamily: polices.times_new_roman}]} numberOfLines={1} ellipsizeMode='tail'>{item.intituler}</Text>
                    <Text style={[tw`${notifies.indexOf(item.id) === -1 ? 'font-semibold text-black' : 'text-gray-600'}`, {fontFamily: polices.times_new_roman}]} numberOfLines={2} ellipsizeMode='tail'>{item.passager}</Text>
                    <Text style={[tw`mt-2 text-gray-400`, {fontFamily: polices.times_new_roman}]}>{getLocalDate(item.dat)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getNotifications();
    }, [reload])
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle='Notifications'
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
                            <HeaderTitle headerTitle='Notifications' />
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />
            {endFetch
            ?
            <FlatList 
                removeClippedSubviews={true}
                initialNumToRender={notifications.length - 1}
                keyboardDismissMode='none'
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
                ListEmptyComponent={ 
                    <View>
                        <Text style={[tw`text-gray-400`, {fontFamily: polices.times_new_roman}]}>{notificationEmptyText}</Text>
                    </View>
                }
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ref={(ref) => {
                    // @ts-ignore
                    setRefList(ref)
                }}
                contentContainerStyle={[ tw`px-4 pt-2` ]}
            />
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default NotificationsView;