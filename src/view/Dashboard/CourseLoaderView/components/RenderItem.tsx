import { CheckBox } from '@rneui/base';
import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { ColorsEncr } from '../../../../assets/styles';
import tw from 'twrnc';
import { WtCar1 } from '../../../../assets';
import { polices } from '../../../../data/data';

interface RenderItemProps {
    getApproximativePrice: any,
    itemSelected: null|number,
    item: any,
    index: number
}
export const RenderItem: React.FC<RenderItemProps> = ({ getApproximativePrice, itemSelected, item, index }) => {

    return (
        <TouchableWithoutFeedback onPress={() => getApproximativePrice(index, item.frais_reservation)}>
            <View style={[ tw`flex-row py-2 mb-2 border ${itemSelected == index ? 'border-red-700 rounded-lg' : 'border-l-white border-t-white border-r-white border-b-slate-200'}`, {} ]}>
                <CheckBox 
                    checked={itemSelected == index ? true : false} 
                    checkedColor={'rgb(185, 28, 28)'}
                    containerStyle={[ tw`p-1`, {alignSelf: 'center'} ]} 
                />
                <View style={[ tw`flex-1 flex-row` ]}>
                    <WtCar1 width={90} height={50} style={{ alignSelf: 'flex-start' }} />
                    <View style={[ tw`flex-1 flex-row items-center px-2` ]}>
                        <View style={[ tw`flex-1` ]}>
                            <Text style={[ tw`text-base text-black font-bold`, {fontFamily: polices.times_new_roman} ]}>{ item.intituler }</Text>
                            <Text style={[ tw`text-xs text-slate-600`, {fontFamily: polices.times_new_roman} ]}>1km</Text>
                        </View>
                        <Text style={[ tw`text-lg pl-2`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{ item.tarif_course_km } XOF</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}