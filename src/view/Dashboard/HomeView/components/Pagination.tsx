import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import tw from'twrnc';
import { ColorsEncr } from '../../../../assets/styles';

interface PaginationProps {
    index: any,
    data: any,
}
const Pagination: React.FC<PaginationProps> = ({ index, data }) => {

    return (
        <>
        {data.length > 1 && (
            <View style={[ tw``, styles.container_dot ]}>
                {/* @ts-ignore */}
                { data.map((slide, idx) => (
                    <View
                        key={ idx.toString() }
                        style={[ styles.dot, {backgroundColor: index == idx ? ColorsEncr.main : '#ddd'} ]} />
                )) }
            </View>
        )}
        </>
    )
}

const styles = StyleSheet.create({
    container_dot: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 100,
        marginHorizontal: 3
    }
})

export default Pagination;