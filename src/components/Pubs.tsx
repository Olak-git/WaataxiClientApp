import { View, Text, Image, Pressable, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import { ColorsEncr } from '../assets/styles';
import { windowHeight, baseUri } from '../functions/functions';
import { openUrl } from '../functions/helperFunction';
import tw from 'twrnc'
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-vector-icons/Icon';

interface ItemProps {
    item: any,
    onHandlePress: () => void,
    containerStyle?: StyleProp<ViewStyle>,
}
const Item: React.FC<ItemProps> = ({ item, onHandlePress, containerStyle }) => {
    
    const width = useWindowDimensions().width;
    const d_height = windowHeight/2;
    const height = d_height < 300 ? 300 : d_height - 100

    return (
        // <Pressable onPress={onHandlePress} style={[ tw`flex-1 my-3 border border-zinc-100 rounded-md mx-2`, styles.container_item, {width: width - 57.9}]}>
        <Pressable 
            onPress={() => {
                if(item.url) {
                    openUrl(item.url)
                } else {
                    onHandlePress()
                }
            }} 
            onLongPress={onHandlePress}
            style={[ tw`my-3 border border-zinc-100 rounded-md mx-2`, styles.container_item, {width: width - 57.9, height: height}, containerStyle]}>
            <View style={[tw``, styles.item ]}>
                <Image
                    defaultSource={require('../assets/images/accueil.png')}
                    style={[tw``, styles.item_image ]}
                    source={{uri: `${baseUri}/assets/articles/${item.article}`} }
                    resizeMode='contain'
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container_item: {
        // width: windowWidth,
        // height: windowHeight - 100,
        alignItems: 'center'
    },
    item: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    item_image: {
        height: '90%',
        width: '100%'
    },
    item_title: {
    }
})

const Pubs : React.FC<{ annonces: Array<any>, images?: Array<any>, containerStyle?: StyleProp<ViewStyle> }> = ({ annonces, images=[], containerStyle }) => {

    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const onHandleImage = (index: number) => {
        setImageIndex(index);
        setVisible(true);
    }

    // @ts-ignore
    const renderItem = ({item, index}) => (
        <Item item={item} onHandlePress={() => onHandleImage(index)} containerStyle={containerStyle} />
    )

    return (
        <>
            <ImageView 
                images={images} 
                imageIndex={imageIndex} 
                visible={visible}
                animationType='slide'
                // presentationStyle='fullScreen'
                doubleTapToZoomEnabled
                onRequestClose={() => {
                    setVisible(false)
                }}
                onImageIndexChange={(index) => setImageIndex(index)}
                keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
            />
            <View style={[tw`flex-1 my-10 px-5`, {}]}>
                <View style={[tw`flex-row items-center`, {}]}>
                    <View style={[tw`flex-1 bg-black`, { height: 1 }]}></View>
                    <Text style={[tw`text-black text-lg font-bold px-4`, {fontFamily: 'MontserratAlternates-Regular'}]}>Bons Plans</Text>
                    <View style={[tw`flex-1 bg-black`, { height: 1 }]}></View>
                </View>
                <SwiperFlatList
                    autoplay
                    autoplayDelay={5}
                    autoplayLoop
                    autoplayLoopKeepAnimation
                    index={0}
                    showPagination
                    data={annonces}
                    renderItem={renderItem}
                    paginationDefaultColor='#ddd'
                    paginationActiveColor={ColorsEncr.main}
                    paginationStyleItem={{width:8, height:8}}
                />
            </View>
        </>
    )
}

export default Pubs