import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { api_ref, apiv3, baseUri, fetchUri, getCurrency, toast, windowWidth } from '../../../functions/functions';
import { MtnMoney, Wallet } from '../../../assets';
import WebView from 'react-native-webview';
import { setUser } from '../../../feature/user.slice';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import FlashMessage from '../../../components/FlashMessage';
import { getErrorsToString } from '../../../functions/helperFunction';
import { polices } from '../../../data/data';
import { updateWallet } from '../../../services/races';

interface PortefeuilleViewProps {
    navigation: any
}
const PortefeuilleView: React.FC<PortefeuilleViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const {height} = useWindowDimensions();

    const webviewRef = useRef(null);

    const [endFetch, setEndFetch] = useState(false);

    const [visible, setVisible] = useState(false);

    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [showGateway, setShowGateway] = useState(false);
    const [inputs, setInputs] = useState({
        mnt: undefined
    });

    const [errors, setErrors] = useState({
        mnt: null
    });

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onHandle = () => {
        setShowGateway(false);
        setVisible(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`update-portefeuille`, null)
        formData.append('token', user.slug)
        formData.append('montant', inputs.mnt)
        
        // updateWallet({ formData })
        //     .then(json => {
        //         setVisible(false);
        //         if(json.success) {
        //             toast('SUCCESS', `Votre portefeuille a été crédité de ${inputs.mnt} FCFA`, false);
        //             // @ts-ignore
        //             const montant = parseFloat(user.portefeuille) + parseFloat(inputs.mnt);
        //             dispatch(setUser({portefeuille: montant}));
        //         } else {
        //             const errors = json.errors;
        //             console.log('Errors: ', errors);
        //             toast('DANGER', getErrorsToString(errors), false);
        //         }
        //     })
        //     .finally(() => {
        //         setVisible(false);
        //     })

        fetch(apiv3 ? api_ref + '/update_wallet.php' : fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            setVisible(false);
            if(json.success) {
                toast('SUCCESS', `Votre portefeuille a été crédité de ${inputs.mnt} FCFA`, false);
                // @ts-ignore
                const montant = parseFloat(user.portefeuille) + parseFloat(inputs.mnt);
                dispatch(setUser({portefeuille: montant}));
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
                toast('DANGER', getErrorsToString(errors), false);
            }
        })
        .catch(e => {
            setVisible(false);
            console.warn(e)
        })
        .finally(() => {
            setVisible(false);
        })
    }

    const onHandleMontant = () => {
        if(inputs.mnt && inputs.mnt >= 500) {
            handleError('mnt', null);
            setShowGateway(true);
        } else {
            handleError('mnt', 'Non valide.');
        }
    }

    const onMessage = (e: any) => {
        const response = JSON.parse(e.nativeEvent.data);
        console.log(response);
        // response.err == DIALOG DISMISSED
        if(typeof response == 'string') {

        } else if(response.hasOwnProperty('status')) {
            const status = response.status.toLowerCase();
            if(status === 'failed') {
                setShowGateway(false);  
                setEndFetch(false);
            } else if(status == 'approved') {
                onHandle();
            }
        } else if(response.hasOwnProperty('fetch') && response.fetch) {
            setEndFetch(true)
        }
    }

    const onSendAmount = () => {
        // @ts-ignore
        webviewRef?.current?.injectJavaScript('getAmount(' + JSON.stringify({mnt: inputs.mnt}) + ')');
    }

    const runFirst = `
        window.isNativeApp = true;
        true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            {showGateway
            ?
                <Modal 
                    visible={showGateway}
                    onDismiss={() => setShowGateway(false)}
                    onRequestClose={() => setShowGateway(false)}
                    animationType='fade'
                    transparent
                >
                    <View style={[ tw`flex-1` ]}>
                        <View style={styles.wbHead}>
                            <TouchableOpacity
                                style={{ padding: 13 }}
                                onPress={() => setShowGateway(false)}>
                                <Icon type='feather' name='x' color='#000000' size={24} />
                            </TouchableOpacity>
                            <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#00457C', fontFamily: polices.times_new_roman }}>GateWay</Text>
                            <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                                <ActivityIndicator size={24} color={ progClr } />
                            </View>
                        </View>
                        <WebView
                            ref={webviewRef}
                            // @ts-ignore
                            source={{uri: baseUri + '/mobile/fedapay-pay/index.html'}}
                            originWhitelist={['*']}
                            onLoadStart={() => {
                                setProg(true);
                                setProgClr('#000');
                            }}
                            onLoadProgress={() => {
                                setProg(true);
                                setProgClr('#00457C');
                            }}
                            onLoadEnd={() => {
                                setProg(false);
                                onSendAmount()
                            }}
                            onLoad={() => {
                                setProg(false);
                            }}             
                            injectedJavaScriptBeforeContentLoaded={runFirst}           
                            onMessage={onMessage}
                            javaScriptEnabled
                            style={[tw`border`]}
                        />
                        {!endFetch && (
                            <View style={[ StyleSheet.absoluteFill, {height: height - 50.5, marginTop: 50.5} ]}>
                                <ActivityLoading loadingText='Chargement en cours...' />
                            </View>
                        )}
                    </View>
                </Modal>
            :
                <>
                    <Header navigation={navigation} headerTitle='Portefeuille' />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[ tw`flex-row justify-center items-center border-b border-gray-100`, {height: 120} ]}>
                            <Wallet width={70} height={70} />
                            <View style={[ tw`ml-3` ]}>
                                <Text style={[ tw`text-gray-500`, {fontFamily: polices.times_new_roman} ]}>Solde actuel</Text>
                                <Text style={[ tw`text-black font-bold text-3xl`, {color: ColorsEncr.main, fontFamily: polices.times_new_roman} ]}>{ getCurrency(user.portefeuille) } F</Text>
                            </View>
                        </View>

                        <View style={[ tw`my-3` ]}>
                            <Text style={[ tw`text-center font-semibold text-black text-xl mb-10`, {fontFamily: polices.times_new_roman} ]}>Recharger votre compte</Text>
                            
                            <InputForm
                                containerStyle={tw`px-10`}
                                label='Montant à recharger'
                                labelStyle={[ tw`text-lg mb-2` ]}
                                placeholder='Entrez un montant'
                                keyboardType={'numeric'}
                                formColor='rgb(209, 213, 219)'
                                error={errors.mnt}
                                value={inputs.mnt}
                                onChangeText={(text: string) => handleOnChange('mnt', text)}
                                inputContainerStyle={[ tw`border rounded`, {height: 45} ]}
                                constructHelper={
                                    <View style={[ tw`flex-row justify-between items-center mt-1` ]}>
                                        <Text style={[ tw`text-gray-600`, {fontFamily: polices.times_new_roman} ]}>Recharge minimale:</Text>
                                        <Text style={[ tw`text-gray-600`, {fontFamily: polices.times_new_roman} ]}>500 F</Text>
                                    </View>
                                } 
                            />
                        </View>
                        <View style={[ tw`justify-center px-10 mb-5`, {height: 80} ]}>
                            <TouchableOpacity
                                // disabled
                                onPress={onHandleMontant}
                                activeOpacity={0.5}
                                style={[ tw`py-3 px-4 rounded`, {backgroundColor: ColorsEncr.main} ]}>
                                <Text style={[ tw`ml-2 text-black text-base text-center`, {fontFamily: polices.times_new_roman} ]}>Recharger</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </>
            }
        </Base>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: 'rgb(4,28,84)',
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 18,
        fontFamily: 'serif'
    },
    paragraph: {
        color: 'rgb(4,28,84)',
        lineHeight: 20,
        textAlign: 'justify',
        fontFamily: 'sans-serif'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
    btnCon: {
        height: 45,
        width: '70%',
        elevation: 1,
        backgroundColor: '#00457C',
        borderRadius: 3,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTxt: {
        color: '#fff',
        fontSize: 18,
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        // zIndex: 25,
        elevation: 2,
        paddingTop: Platform.OS == 'android' ? 0:20
    }
})

export default PortefeuilleView;