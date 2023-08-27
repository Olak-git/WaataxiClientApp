import React, { useEffect } from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { windowWidth, windowHeight, baseUri } from '../../../../functions/functions';
import { openUrl } from '../../../../functions/helperFunction';


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
                    defaultSource={require('../../../../assets/images/accueil.png')}
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

export default Item;