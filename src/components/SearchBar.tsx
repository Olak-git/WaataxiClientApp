import React from 'react';
import { View, TextInput, ActivityIndicator, Pressable, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import tw from 'twrnc';

interface SearchBarProps {
    containerStyle?: StyleProp<ViewStyle>,
    iconSearchName?: string,
    iconSearchColor?: string,
    iconSearchSize?: number,
    iconClearColor?: string,
    iconClearSize?: number,
    showLoading?: boolean,
    loadingColor?: string,
    placeholder?: string,
    placeholderTextColor?: string,
    onChangeText?: any,
    value?: string | undefined,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
    onEndEditing?: any,
    showCancel?: boolean,
    cancelText?: string,
    onCancel?: any,
    cancelStyle?: StyleProp<ViewStyle>,
    cancelTextStyle?: StyleProp<TextStyle>
}
const SearchBar: React.FC<SearchBarProps> = ({ containerStyle, iconSearchName = 'search1', iconSearchColor = '#000000', iconSearchSize=25, iconClearColor, iconClearSize=20, showLoading = false, loadingColor = '#fef', placeholder, placeholderTextColor, onChangeText = () => {}, value, inputContainerStyle, inputStyle, onEndEditing = () => {}, showCancel = false, cancelText = 'Cancel', onCancel = () => {}, cancelStyle, cancelTextStyle }) => {
    const onClear = () => {
        onChangeText('')
    }

    return (
        <View style={[ tw`flex-row items-center items-end`, {height: 50}, containerStyle ]}>
            <View style={[ tw`flex-1 flex-row items-center border-b border-slate-700`, {height: '100%'}, inputContainerStyle ]}>
                <View style={[ tw``, {width: 40} ]}>
                    <Icon 
                        name={iconSearchName}
                        size={iconSearchSize}
                        color={iconSearchColor} />
                </View>
                <TextInput
                    placeholder={ placeholder }
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={onChangeText}
                    onEndEditing={onEndEditing}
                    // defaultValue={value}
                    value={value}
                    style={[ tw`flex-1 px-1 text-base text-gray-600`, inputStyle ]} />
                {showLoading && (
                    <View style={[ tw``, {} ]}>
                        <ActivityIndicator 
                            size={20}
                            color={loadingColor} />
                    </View>
                )}
                {value !== '' && (
                    <Pressable
                        onPress={onClear}
                        style={[ tw`justify-center`, {width: 30, height: '100%'} ]}>
                        <Icon 
                            name='close' 
                            size={iconClearSize}
                            color={iconClearColor}
                            style={[ tw`text-right` ]} />
                    </Pressable>
                )}
            </View>
            {showCancel && (
                <Pressable onPress={onCancel} style={[ tw`justify-center items-center px-3 ml-3`, {height: '100%'}, cancelStyle ]}>
                    <Text style={[ cancelTextStyle ]}>{cancelText}</Text>
                </Pressable>
            )}
        </View>
    )
}

export default SearchBar;