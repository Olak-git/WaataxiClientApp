import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Keyboard, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';

interface TextareaFormProps {
    containerStyle?: StyleProp<ViewStyle>,
    label?: string, 
    labelStyle?: StyleProp<TextStyle>,
    formColor?: string,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<ViewStyle>,
    numberOfLines?: number,
    defaultValue?: string | undefined,
    value?: string | undefined,
    placeholder?: string,
    placeholderTextColor?: string,
    helper?: string,
    helperStyle?: StyleProp<TextStyle>,
    constructHelper?: React.ReactElement<{}>,
    onFocus?: any,
    onChangeText?: any,
    error?: null|string
}

const TextareaForm: React.FC<TextareaFormProps> = ({ containerStyle, label, labelStyle, formColor = 'rgb(209, 213, 219)', inputContainerStyle, inputStyle, numberOfLines = 4, placeholderTextColor = '#cccccc', helper, helperStyle, constructHelper, onFocus=()=>{}, error, ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

    return (
        <View style={[ tw`mb-2`, containerStyle ]}>
            {label && (
                <Text style={[ styles.label, labelStyle ]}>{label}</Text>
            )}
            <View style={[ tw`border bg-white`, styles.inputContainer, { borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor }, inputContainerStyle ]}>
                <TextInput 
                    multiline
                    numberOfLines={numberOfLines}
                    placeholderTextColor={placeholderTextColor}
                    autoCorrect={false}
                    // autoCapitalize='none'
                    onFocus={() => {
                        onFocus()
                        setIsFocused(true)
                    }}
                    onBlur={() => setIsFocused(false)}
                    style={[ tw`flex-1 border-0 text-slate-500`, {textAlignVertical: 'top', justifyContent: 'flex-start', height: '100%'}, inputStyle]}
                    {...props} />
            </View>
            { helper
                ?
                <Text style={ helperStyle }>{ helper }</Text>
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
        // height: 50,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 15,
        // borderRadius: 6,
        // borderWidth: 0.5
    }
})

export default TextareaForm;