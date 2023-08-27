import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
import { Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputAuthFormProps {
    label?: string, 
    labelStyle?: any,
    iconName?: string, 
    error?: any, 
    password?: boolean, 
    onFocus?: any,
    formColor?: string,
    className?: string,
    helper?: string,
    rightContent?: any
    onChangeText?: any,
    keyboardType?: any,
    placeholder?: string,
    multiline?: boolean,
    numberOfLines?: number,
    defaultValue?: string,
    editable?: boolean
}

const InputAuthForm: React.FC<InputAuthFormProps> = ({ label, labelStyle = {}, iconName, error, password = false, onFocus=()=>{}, formColor = '#ffffff', className = '', helper, rightContent, ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(password)

    return (
        <View style={ tw`mb-5` }>
            <View style={[ tw`border rounded-lg bg-white ${className}`, {elevation: 10, shadowColor: '#000000', shadowOffset: {width: 0, height: 10}, shadowRadius: 2, shadowOpacity: 0.5, borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor, paddingHorizontal: 15} ]}>
                {label && (
                    <Text style={[ tw`font-bold`, styles.label, labelStyle ]}>{label}</Text>
                )}
                <View style={[ tw`border-0`, styles.inputContainer, {  } ]}>
                    {iconName && (
                        <Icon
                            style={[ tw`mr-2` ]}
                            name={iconName}
                            color={isFocused ? '#000' : '#cccccc'}
                            size={20} />
                    )}
                    <TextInput 
                        // keyboardType='phone-pad'
                        placeholderTextColor={'#cccccc'}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onFocus={() => {
                            onFocus()
                            setIsFocused(true)
                        }}
                        onBlur={() => setIsFocused(false)}
                        style={[ tw`flex-1 border-0 text-cyan-800`, {}]}
                        secureTextEntry={showPassword}
                        {...props} />
                    {password && (
                        <Icon
                            style={[ tw`ml-1` ]}
                            name={showPassword ? 'eye-off' : 'eye'}
                            color={isFocused ? '#000000' : '#cccccc'}
                            size={20}
                            onPress={() => setShowPassword(!showPassword)} />
                    )}
                    { rightContent }
                </View>
                { helper && (
                    <Text>{ helper }</Text>
                )}
            </View>
            { error && (
                <Text style={[ tw`text-black text-sm` ]}>{ error }</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 16,
        color: Colors.dark
    },
    inputContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default InputAuthForm;