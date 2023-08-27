import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Keyboard, StyleProp, ViewStyle, TextStyle, KeyboardType, Platform } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
// import { Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ColorsEncr } from '../assets/styles';

interface InputFormProps {
    label?: string, 
    labelStyle?: StyleProp<TextStyle>,
    iconName?: string,
    leftComponent?: React.ReactElement,
    error?: null|string, 
    password?: boolean, 
    onFocus?: any,
    onBlur?: any,
    formColor?: string,
    containerStyle?: StyleProp<ViewStyle>,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputParentStyle?:  StyleProp<ViewStyle>,
    inputStyle?: StyleProp<ViewStyle>,
    codeCountry?: string,
    helper?: string,
    constructHelper?: React.ReactElement<{}>,
    helperStyle?: StyleProp<TextStyle>,
    rightContent?: undefined | React.ReactElement,
    onChangeText?: any,
    keyboardType?: KeyboardType,
    placeholder?: string,
    placeholderTextColor?: string,
    multiline?: boolean,
    numberOfLines?: number,
    defaultValue?: string | undefined,
    value?: string | undefined,
    maxLength?: number,
    editable?: boolean
}

const InputForm: React.FC<InputFormProps> = ({ label, labelStyle, iconName, leftComponent, error, password = false, onFocus=()=>{}, onBlur=() => {}, formColor = '#ffffff', containerStyle, inputContainerStyle, inputParentStyle, inputStyle, codeCountry, helper, constructHelper, helperStyle, rightContent, placeholderTextColor = '#cccccc', ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(password)

    return (
        <View style={[ tw`mb-2`, containerStyle ]}>
            {label && (
                <Text style={[ styles.label, labelStyle ]}>{label}</Text>
            )}
            <View style={[ tw`bg-white`, styles.inputContainer, { borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor }, inputContainerStyle ]}>
                {iconName 
                    ?
                    <Icon
                        style={[ tw`mr-2` ]}
                        name={iconName}
                        color={isFocused ? '#000' : '#cccccc'}
                        size={20} />
                    :
                    leftComponent
                }
                <View style={[ tw`flex-row items-center flex-1`, {height: '100%'}, inputParentStyle ]}>
                    {codeCountry && (
                        <Text style={[ tw`text-base text-black px-2` ]}>{ codeCountry }</Text>
                    )}
                <TextInput 
                    // keyboardType=''
                    // keyboardType='email-address'
                    placeholderTextColor={placeholderTextColor}
                    autoCorrect={false}
                    // autoCapitalize='none'
                    onFocus={() => {
                        onFocus()
                        setIsFocused(true)
                    }}
                    onBlur={() => setIsFocused(false)}
                    style={[ tw`flex-1 border-0 text-slate-500 ${Platform.OS == 'android' ? '' : 'px-2'}`, {height: '100%'}, inputStyle]}
                    secureTextEntry={showPassword}
                    underlineColorAndroid="transparent"
                    {...props} />
                </View>
                {password && (
                    <Icon
                        style={[ tw`ml-1` ]}
                        name={showPassword ? 'eye-off' : 'eye'}
                        color={isFocused ? '#000' : '#cccccc'}
                        size={20}
                        onPress={() => setShowPassword(!showPassword)} />
                )}
                { rightContent }
            </View>
            {helper
                ?
                <Text style={[tw`text-black`, helperStyle]}>{ helper }</Text>
                :
                constructHelper
            }
            { error && (
                <Text style={[ tw`text-orange-700 text-sm` ]}>{ error }</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 2,
        fontSize: 14,
        color: Colors.dark
    },
    inputContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 15,
        // borderBottomWidth: 1, 
        // borderBottomColor: ColorsEncr.main_sm
    }
})

export default InputForm;