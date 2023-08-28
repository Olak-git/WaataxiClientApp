import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { setReload } from '../../../feature/reload.slice';
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import { RNPModal } from '../../../components/RNPModal';
import { ImageSource } from 'react-native-vector-icons/Icon';
import ImageView from 'react-native-image-viewing';
import { callPhoneNumber, openUrl } from '../../../functions/helperFunction';
import { polices } from '../../../data/data';
// import { Modal, Portal, Button, Provider } from 'react-native-paper';

const SectionData: React.FC<{
    iconType?: string,
    iconName: string,
    iconSize?: number,
    text: string,
    onPress?: () => void
}> = ({iconType = 'font-awesome-5', iconName, iconSize = 20, text, onPress}) => {
    return (
        <View style={tw`flex-row mb-3 pb-2 border-b border-gray-200`}>
            <Icon type={iconType} name={iconName} size={iconSize} />
            <Text onPress={onPress} style={[tw`text-black ml-2`, {fontFamily: polices.times_new_roman}]}>{text}</Text>
        </View>  
    )
}

interface ProfilConducteurViewProps {
    navigation: any,
    route?: any
}
const ProfilConducteurView: React.FC<ProfilConducteurViewProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const { conducteur } = route.params;
    const src = conducteur.img ? {uri: baseUri + '/assets/avatars/' + conducteur.img} : require('../../../assets/images/user-1.png');

    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState({
        total: 0,
        unit: 0
    });
    const reload = useSelector((state: any) => state.reload.value);
    const [endFetch, setEndFetch] = useState(false);

    const [visiblePaperModal, setVisiblePaperModal] = useState(false);

    const showModal = () => setVisiblePaperModal(true);
    const hideModal = () => setVisiblePaperModal(false);

    const ratingCompleted = (rate: number) => {
        setRating((state) => ({...state, unit: rate}));
        // console.log("Rating is: " + rate)
    }

    const onHandle = () => {
        setShow(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('rating', null);
        formData.append('account', 'passager');
        formData.append('token', user.slug);
        formData.append('to', conducteur.slug);
        formData.append('score', rating.unit);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setShow(false);
            if(json.success) {
                setVisible(false);
                dispatch(setReload());
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            setShow(false);
            console.log('ProfilConducteurView Error1: ', error);
        })
    }

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('data-user', conducteur.slug);
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
                setRating(state => ({...state, total: json.scores, unit: json.score}));
            } else {
                const errors = json.errors;
                console.log(errors);
            }
            setEndFetch(true);
        })
        .catch(error => {
            console.log('ProfilConducteurView Error2: ', error);
        })
    }

    useEffect(() => {
        getDataUser();
    }, [reload])
    
    return (
        <Base>
            <ModalValidationForm showModal={show} />
            <ImageView 
                images={[src]} 
                imageIndex={0} 
                visible={visiblePaperModal}
                animationType='slide'
                // presentationStyle='fullScreen'
                doubleTapToZoomEnabled
                onRequestClose={function (): void {
                    hideModal()
                    // throw new Error('Function not implemented.');
                }}
                keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
            />
            {/* <RNPModal showModal={visiblePaperModal} onClose={hideModal}>
                <View style={[tw`rounded-lg p-3 bg-white`, {width: 300, height: 400}]}>
                <Image
                    resizeMode='stretch'
                    source={src}
                    style={[tw``, {height: '100%', width: '100%'}]} />
                </View>
            </RNPModal> */}

            <Header navigation={navigation} headerTitle='Profil Conducteur' />

            {endFetch
            ?
                <>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={[ tw`mt-5 mb-3 px-10 flex-row` ]}>
                        
                        <View style={tw`items-center`}>
                            <Pressable
                                onPress={showModal}
                                style={[tw`rounded-full mb-2`]}
                                disabled={conducteur.img ? false : true}
                            >
                                <Image
                                    source={src}
                                    style={[tw`rounded-full`, {height: 100, width: 100}]} />
                            </Pressable>
                            <Rating
                                readonly
                                startingValue={rating.total}
                                ratingCount={5}
                                imageSize={18}
                                ratingColor={ColorsEncr.main}
                            />
                        </View>

                        <View style={[tw`flex-1 ml-3 border-gray-300 pl-3`, {borderLeftWidth: 0.5}]}>
                            <SectionData iconName='mobile-alt' text={conducteur.tel} onPress={() => callPhoneNumber(conducteur.tel)} />
                            <SectionData iconType='font-awesome' iconName='user-o' text={conducteur.nom + ' ' + conducteur.prenom} />
                            <SectionData iconType='entypo' iconName='email' text={conducteur.email} />
                            <SectionData iconName='globe-africa' text={conducteur.pays} />
                        </View>

                    </View>

                    {visible && (
                        <View style={tw`flex-row justify-around items-center mt-10`}>
                            <Rating
                                startingValue={rating.unit}
                                ratingCount={5}
                                jumpValue={.5}
                                imageSize={28}
                                ratingColor={ColorsEncr.main}
                                onFinishRating={ratingCompleted}
                            />
                            <Pressable
                                onPress={onHandle}
                                style={[tw`rounded-lg border border-orange-600 py-2 px-3`, {borderColor: ColorsEncr.main, minWidth: 100}]}>
                                <Text style={[tw`text-center`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman}]}>Attribuer une note</Text>
                            </Pressable>
                        </View>  
                    )}

                </ScrollView>

                <Pressable
                    onPress={() => setVisible(!visible)}
                    style={tw`absolute bottom-2 right-1`}>
                    <Icon type='ant-design' name='staro' reverse />
                </Pressable>
                </>
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default ProfilConducteurView;