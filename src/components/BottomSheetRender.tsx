import React from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';
import InputForm from './InputForm';
import { RNDivider } from './RNDivider';
import tw from 'twrnc';
import { BottomSheetRenderItem } from './BottomSheetRenderItem';
import { polices } from '../data/data';

interface BottomSheetRenderProps {
    data: any,
    onSelect: any,
    itemSelected: null|number,
    value?: string | undefined,
    handlePlace?: any,
    error?: null|string,
    text?: string,
    textStyle?: StyleProp<TextStyle>,
    action?: string
}
export const BottomSheetRender: React.FC<BottomSheetRenderProps> = ({ data, onSelect = () => {}, itemSelected, text, textStyle, action, value, handlePlace = () => {}, error }) => {

    return (
        <>
            <View>
                <Text style={[ tw`text-black text-base text-center font-bold`, {fontFamily: polices.times_new_roman}, textStyle ]}>{text||'Sélectionner un tye de voiture'}</Text>
                <View style={[ tw`items-center px-30` ]}>
                    <RNDivider size={2} color={'grey'} />
                </View>
                <View style={[ tw`` ]}>
                    {data.map((item: any, index: number) => <BottomSheetRenderItem key={index.toString()} getApproximativePrice={onSelect} itemSelected={itemSelected} item={item} index={index} action={action} />)}
                </View>
            </View>

            <View>
                <View style={[ tw`items-center px-30` ]}>
                    <RNDivider size={2} color={'grey'} />
                </View>
                {/* <Text style={[ tw`text-black text-sm text-center font-bold` ]}>Combien voulez-vous de places ?</Text>
                <View style={[ tw`items-center px-30` ]}>
                    <RNDivider size={2} color={'grey'} />
                </View>

                <View>
                    <InputForm
                        defaultValue='1'
                        placeholder='Maximum 4'
                        keyboardType='numeric'
                        value={value}
                        onChangeText={handlePlace}
                        error={error}
                        containerStyle={tw`mt-5`}
                        inputContainerStyle={[ tw`border rounded border-gray-300 border-b-gray-300`, {height: 45} ]}
                        constructHelper={
                            <View style={[ tw`flex-row justify-between items-center mt-1` ]}>
                                <Text style={[ tw`text-gray-600` ]}>Minimum:</Text>
                                <Text style={[ tw`text-gray-600` ]}>1</Text>
                            </View>
                        } 
                    />
                </View> */}
            </View>
        </>
    )
}