import { View, Text, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { ColorsEncr } from '../../../../assets/styles'
import { Divider, Icon } from '@rneui/base'
import tw from 'twrnc'
import { Button } from 'react-native-paper'
import { account, fetchUri, toast } from '../../../../functions/functions'

interface VerifCodeProps {
    inputs: any,
    handleOnChange:(a:string,b:any)=>void,
    pin_count: number,
    setConfirm: (a:boolean)=>void
}
const VerifCode: React.FC<VerifCodeProps> = ({inputs, handleOnChange, pin_count, setConfirm}) => {

    const { code } = inputs;

    const [otpCode, setOtpCode] = useState('')
    const [otpError, setOtpError] = useState(false)

    const [disabled, setDisabled] = useState(true)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const resendCode = () => {
        let valide = true;

        if(valide) {
            setLoading2(true)
            const formData = new FormData();
            formData.append('js', null);
            formData.append('reset_password[account]', account);
            formData.append('reset_password[email]', inputs.email);
            formData.append('reset_password[tel]', inputs.tel);
            formData.append('reset_password[code]', code);

            console.log('DATA: ', formData);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if(json.success) {
                    toast('SUCCESS', 'Code renvoyé.')
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setLoading2(false)
            })
        }
    }

    const onHandle = () => {
        if(code == otpCode) {
            setOtpError(false)
            setConfirm(true)
        } else {
            setOtpError(true)
            toast('DANGER', 'Mauvais code')
        }
    }

    const handleCodeChanged = (code:any) => {
        setOtpCode(code)
    }

    const call_func = () => {
        if(otpCode.length < pin_count) {
            setDisabled(true)
            setLoading1(false)
            setOtpError(false)
        } else {
            onHandle()
        }
    }

    useEffect(() => {
        call_func()
    }, [otpCode, code])

    return (
        <>
            <View style={[ tw`items-center mt-1 mb-4` ]}>
                <Icon onPress={()=>handleOnChange('code', null)} type='ionicon' name='arrow-back-outline' containerStyle={tw`absolute left-2 top-5`} />
                <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>waa<Text style={{color: ColorsEncr.main}}>taxi</Text></Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={tw`flex-1`}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                    <Text style={[ tw`text-center text-base text-gray-500 mt-20 mb-2` ]}>CODE</Text>
                    
                    <Text style={[ tw`text-center text-base text-black mb-5` ]}>Veuillez entrer le code ici</Text>
                    
                    <View style={[tw`px-10`, {} ]}>
                        <OTPInputView
                            style={{height: 60}}
                            // keyboardType='default'
                            code={otpCode}
                            pinCount={pin_count}
                            onCodeChanged = {handleCodeChanged}
                            autoFocusOnLoad
                            // @ts-ignore
                            codeInputFieldStyle={[styles.underlineStyleBase, {color: otpError?'rgb(153,27,27)':'black'}]}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled = {(code => {
                                console.log(`Code is ${code}, you are good to go!`)
                                setDisabled(false)
                            })}
                        />

                        <Divider color={ColorsEncr.main_sm} style={[tw`mb-1 mt-5`]} />
                        <Button onPress={onHandle} mode='outlined' loading={loading1} disabled={disabled} contentStyle={tw`p-2`} color={ColorsEncr.main_sm}>
                            Valider
                        </Button>

                        <Button onPress={resendCode} mode='text' loading={loading2} disabled={loading2} style={tw`mt-4`}>Renvoyer le code</Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default VerifCode

const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45
    },
  
    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },
  
    underlineStyleBase: {
      width: 50,
      borderRadius: 4,
      fontSize: 20,
      height: 45,
      backgroundColor: 'rgb(241, 245, 249)',
      borderWidth: 0,
    //   borderBottomWidth: 1,
    },
  
    underlineStyleHighLighted: {
      borderColor: "#03DAC6",
    },
  });