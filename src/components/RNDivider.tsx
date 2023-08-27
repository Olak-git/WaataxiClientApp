import React from 'react';
import { StyleSheet, View } from 'react-native';

interface RNDividerProps {
    containerSize?: number,
    size?: number,
    space?: number,
    color?: string
}

export const RNDivider: React.FC<RNDividerProps> = ({ containerSize, size = 4, space = 15, color = 'grey' }) => {
    return (
        <View style={[styles.line, {width: containerSize, height: size, marginVertical: space, backgroundColor: color}]} />
    )
}

const styles = StyleSheet.create({
    line: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 2
    }
})
