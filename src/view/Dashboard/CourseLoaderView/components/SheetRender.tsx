import React from 'react';
import { View, Text } from 'react-native';
import InputForm from '../../../../components/InputForm';
import { RNDivider } from '../../../../components/RNDivider';
import tw from 'twrnc';
import { RenderItem } from './RenderItem';

interface SheetRenderProps {
    data: any,
    getApproximativePrice: any,
    itemSelected: null|number,
    value?: string | undefined,
    handlePlace?: any,
    error?: null|string
}
export const SheetRender: React.FC<SheetRenderProps> = ({ data, getApproximativePrice = () => {}, itemSelected, value, handlePlace = () => {}, error }) => {

    return (
        <>
            <View>
                <Text style={[ tw`text-black text-base text-center font-bold` ]}>Sélectionner un tye de voiture</Text>
                <View style={[ tw`items-center px-30` ]}>
                    <RNDivider size={2} color={'grey'} />
                </View>
                <View style={[ tw`` ]}>
                    {data.map((item: any, index: number) => <RenderItem key={index.toString()} getApproximativePrice={getApproximativePrice} itemSelected={itemSelected} item={item} index={index} />)}
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