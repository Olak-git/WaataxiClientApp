import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import tw from'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { windowHeight } from '../../../functions/functions';
import { polices } from '../../../data/data';

interface PaginationProps {
    index: any,
    data: any,
    handleOnChange: any
}
const Pagination: React.FC<PaginationProps> = ({ index, data, handleOnChange = () => {} }) => {

    const {height} = useWindowDimensions();

    return (
        <View style={[ styles.container_dot, {bottom: height < windowHeight ? 30 : 50} ]}>
            {/* { index == data.length - 1 ? 
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={ handleOnChange }
                    style={[ tw`rounded p-3 bg-cyan-700`, { position: 'absolute', bottom: -15 }]}>
                    <Text style={[ tw`text-white`, {fontFamily: polices.times_new_roman} ]}>Continuer</Text>
                </TouchableOpacity> : 
                // @ts-ignore
                data.map((slide, idx) => (
                    <View
                        key={ idx }
                        style={[ styles.dot, {backgroundColor: index == idx ? 'green' : 'silver'} ]} />
                ))
            } */}

            {/* @ts-ignore */}
            { data.map((slide, idx) => (
                <View
                    key={ idx.toString() }
                    style={[ styles.dot, {backgroundColor: index == idx ? ColorsEncr.main : 'silver'} ]} />
            )) }
            { index === data.length - 1 && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={ handleOnChange }
                    style={[ tw`rounded p-3`, { position: 'absolute', right: 10, bottom: -15, backgroundColor: ColorsEncr.main }]}>
                    <Text style={[ tw`text-white`, {fontFamily: polices.times_new_roman} ]}>Commencer</Text>
                </TouchableOpacity>
            ) }
        </View>
    )
}

const styles = StyleSheet.create({
    container_dot: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 50
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginHorizontal: 3
    }
})

export default Pagination;