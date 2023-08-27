import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import TextareaForm from '../../../components/TextareaForm';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri } from '../../../functions/functions';
import { ImageSource } from 'react-native-vector-icons/Icon';
import ImageView from 'react-native-image-viewing';

const SectionData: React.FC<{
    iconType?: string,
    iconName: string,
    iconSize?: number,
    text: string
}> = ({iconType = 'font-awesome-5', iconName, iconSize = 20, text}) => {
    return (
        <View style={tw`flex-row mb-3 pb-2 border-b border-gray-200`}>
            <Icon type={iconType} name={iconName} size={iconSize} />
            <Text style={tw`text-black ml-2`}>{text}</Text>
        </View>  
    )
}

interface MyAccountViewProps {
    navigation: any
}
const MyAccountView: React.FC<MyAccountViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const src = user.img ? {uri: user.img} : require('../../../assets/images/user-1.png');

    const [visible, setVisible] = useState(false);

    const [rating, setRating] = useState(0);

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('rating-user', null);
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
                setRating(json.scores);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('MyAccountView Error: ', error);
        })
    }

    useEffect(() => {
        getDataUser();
    }, [])
    
    return (
        <Base>
            {user.img && (
                <ImageView 
                    images={[src]} 
                    imageIndex={0} 
                    visible={visible}
                    animationType='slide'
                    // presentationStyle='fullScreen'
                    doubleTapToZoomEnabled
                    onRequestClose={() => {
                        setVisible(false)
                    }}
                    keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
                />
            )}
            <Header navigation={navigation} headerTitle='Compte' />
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={[ tw`mt-5 mb-3 px-10 flex-row` ]}>
                    
                    <View style={tw`items-center`}>
                        <Pressable onPress={() => setVisible(true)} disabled={user.img ? false : true} style={tw`mb-2`}>
                            <Image
                                onMagicTap={() => console.log('Booo')}
                                source={src}
                                style={[tw`rounded-full`, {height: 100, width: 100}]} />
                        </Pressable>
                        <Rating
                            readonly
                            startingValue={rating}
                            ratingCount={5}
                            imageSize={18}
                            ratingColor={ColorsEncr.main}
                        />
                    </View>

                    <View style={[tw`flex-1 ml-3 border-gray-300 pl-3`, {borderLeftWidth: 0.5}]}>
                        <SectionData iconName='mobile-alt' text={user.tel} />
                        <SectionData iconType='font-awesome' iconName='user-o' text={user.nom + ' ' + user.prenom} />
                        <SectionData iconType='entypo' iconName='email' text={user.email} />
                        <SectionData iconName='globe-africa' text={user.pays} />
                    </View>

                </View>

            </ScrollView>

            <Pressable
                onPress={() => navigation.navigate('DashEditMyAccount')}
                style={tw`absolute bottom-2 right-1`}>
                <Icon type='entypo' name='pencil' reverse />
            </Pressable>
        </Base>
    )

}

export default MyAccountView;