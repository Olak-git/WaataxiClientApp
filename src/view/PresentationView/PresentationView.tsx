import { CommonActions, StackActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, LogBox, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ColorsEncr } from '../../assets/styles';
import { setPresentation, setWelcome } from '../../feature/init.slice';
import { windowWidth } from '../../functions/functions';
import Item from './components/Item';
import Pagination from './components/Pagination';
import { slides } from './components/slides';

const SLIDES = slides;

interface PresentationViewProps {
    navigation: any
}
const PresentationView: React.FC<PresentationViewProps> = ({navigation}) => {

    const {width} = useWindowDimensions();

    const [currentIndex, setCurrentIndex] = React.useState(0)

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);
    
    const { presentation } = init;

    // @ts-ignore
    const renderItem = ({item}) => (
        <Item item={item} />
    )

    const handleOnScroll = (event: any) => {
        // Slide Width
        const slideSize = width;

        // Offset Scroll
        const n = event.nativeEvent.contentOffset.x / slideSize
        const roundIndex = Math.round(n)

        // setCurrentIndex
        if(currentIndex !== roundIndex) {
            setCurrentIndex(roundIndex)
        }
    }

    const dispatchNavigation = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Auth'}
                ]
            })
        )
    }

    const handleOnChange = async () => {
        await dispatch(setPresentation(true));
    }

    // useEffect(() => {
    //     navigation.dispatch(
    //         CommonActions.reset({
    //             index: 0,
    //             routes: [
    //                 {name: 'Welcome'}
    //             ]
    //         })
    //     )
    // }, [])

    useEffect(() => {
        if(presentation) {
            dispatchNavigation()
        }
    }, [presentation])

    return (
        <SafeAreaView style={[styles.container]}>
            <StatusBar
                backgroundColor='#FFFFFF'
            />
            <FlatList 
                data={ SLIDES }
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={ false }
                pagingEnabled
                onScroll={handleOnScroll}
            />
            {/* @ts-ignore */}
            <Pagination handleOnChange={ handleOnChange } index={ currentIndex } data={ SLIDES } />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative'
    }
})

export default PresentationView;