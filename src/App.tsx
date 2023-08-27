/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useColorScheme, View, Text, LogBox, Platform, DeviceEventEmitter, Modal } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from './app/store';
import { ignoreLogs } from './functions/functions';
import Orientation from 'react-native-orientation-locker';
import RootNavigator from './Routes/RootNavigator';
import { Root } from 'react-native-alert-notification';
import { Button } from 'react-native-paper';
import { getVersion, useManufacturer } from 'react-native-device-info';
import tw from 'twrnc'
import { openUrl } from './functions/helperFunction';
import { app_links } from './data/data';
import { Icon } from '@rneui/base';

// ignoreLogs();
LogBox.ignoreAllLogs();

Orientation.lockToPortrait();

let persistor = persistStore(store)

interface AppProps {
}
const App: React.FC<AppProps> = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [visible, setVisible] = useState(false)
  const [close, setClose] = useState(false)

  const onClose = ()=>{
    setVisible(false)
    setClose(true)
  }

  const parse_int = useCallback((a)=>{
    return a.replace(/\./g, '')*1
  },[])
  
  const event = DeviceEventEmitter.addListener('check.version', (data) => {
    const v = data[Platform.OS];
    const w = getVersion();
    if(v != w && parse_int(v) > parse_int(w) && !visible && !close) {
      setVisible(true)
    }
  })

  useEffect(()=>{
    if(close) {
      setTimeout(()=>{
        setClose(false)
      }, 36000*1000)
    }
  },[close])

  useEffect(()=>{
    console.log('Version: ',getVersion());
    return ()=>{
      event.remove()
    }
  },[visible])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root theme='dark'>
          <RootNavigator />

          <Modal 
            transparent
            visible={visible}
            animationType='slide'
            statusBarTranslucent
            children={
              <View style={[tw`flex-1 bg-white`]}>
                <View style={tw`px-3`}>

                  <View style={tw`flex-row items-center mt-10`}>
                    <Icon type="entypo" name={Platform.OS=='ios'?'app-store':'google-play'} containerStyle={tw``} />
                    <Text style={tw`flex-1 text-black ml-2`}>{Platform.OS=='ios'?'App Store':'Google Play'}</Text>
                  </View>

                  <Icon onPress={onClose} type='evilicon' name='close' size={30} containerStyle={tw`self-end mt-3 mr-0`} />
                            
                  <View style={tw`mt-4`}>
                    <Text style={tw`text-black font-black text-lg`}>Mise à jour disponible</Text>
                    <Text style={tw`text-black mt-3`}>Pour utiliser votre application, téléchargez la dernière version disponible.</Text>
                    <Button 
                      mode='contained'
                      // @ts-ignore
                      onPress={()=>openUrl(app_links[Platform.OS])}
                      style={tw`bg-black rounded-3xl mt-5`}
                    >
                      Mettre à jour
                    </Button>
                  </View>
                </View>
              </View>
            }
          />
        </Root>
      </PersistGate>
    </Provider>
  );
};

export default App;
