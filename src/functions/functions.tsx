import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Dimensions, PermissionsAndroid, Platform, LogBox, useWindowDimensions } from "react-native";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
// import RNFetchBlob from "rn-fetch-blob";

export const ignoreLogs = () => {
    LogBox.ignoreLogs([
        'ViewPropTypes will be removed from React Native', 
        'Require cycle',
        'Require cycle: node_modules\rn-fetch-blob\index.js',
        'VirtualizedList: You have a large list that is slow to update',
        'Warning: \rn-fetch-blob\index.js',
        'Non-serializable values were found in the navigation state.',
        'redux-persist: rehydrate for "root"',
        '`new NativeEventEmitter()` was called with a non-null argument',
        'Warning: Can\'t perform a React state update on an unmounted component',
        'SyntaxError: JSON Parse error: Unexpected identifier "SQLSTATE"',
        "EventEmitter.removeListener('keyboardDidShow', ...): Method has been deprecated.",
    ]);
}

export type TOAST_TYPE = 'SUCCESS'|'DANGER'|'WARNING';
export const toast = (type: TOAST_TYPE, message: string, close: boolean|number = true, title: string|undefined = undefined) => {
    // @ts-ignore
    Toast.show({
        // @ts-ignore
        type: ALERT_TYPE[type],
        title: title,
        textBody: message,
        autoClose: close
    })
}

export const validatePassword = (pass: string) => {
    const reg = /(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\W])/
    return reg.test(pass)
}

export const validateEmail = (email: string) => {
    const reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    return reg.test(email)
}

export const validatePhoneNumber = (phone: string) => {
    const reg = /^[+]{1}[0-9 ]*/i;
    return reg.test(phone)
}

export const getUser = async () => {
    const user = await AsyncStorage.getItem('user') 
    return user ? JSON.parse(user).data : user;
}

export const sleep = (time: number) => {
    for(let t = 1; t <= time; t++) {
        console.log(t)
    }
}

export const getDate = () => {
    const dat = new Date()
    const time = dat.toLocaleTimeString();
    const date = dat.getFullYear() + '-' + ((dat.getMonth() + 1) < 10 ? '0' + (dat.getMonth() + 1) : (dat.getMonth() + 1)) + '-' + (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate())
    return date + ' ' + time;
}

export const getCurrentDate = () => {
    const dat = new Date()
    const date = dat.getFullYear() + '-' + ((dat.getMonth() + 1) < 10 ? '0' + (dat.getMonth() + 1) : (dat.getMonth() + 1)) + '-' + (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate())
    return date;
}

export const getHourOfDate = (date: string) => {
    date = date.replace(/([0-9-]+) /g, '')
    return date;
}

export const getDiscussDate = (date: string) => {
    let _hour = getHourOfDate(date)
    let _date = date.replace(/( [0-9:]+)/g, '')
    let current_date = getCurrentDate();
    if(Date.parse(_date) === Date.parse(current_date)) {
        return _hour;
    } else {
        return _date;
    }
}

export const formatDate = (date: string) => {
    date = date.replace(/( [0-9:]+)/g, '')
    const dat = new Date(date)
    return (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate()) + '/' + ((dat.getMonth() + 1) < 10 ? '0' + (dat.getMonth() + 1) : (dat.getMonth() + 1)) + '/' + dat.getFullYear()
    // return dat.getDate() + '/' + dat.getMonth() + '/' + dat.getFullYear()
}

export const formatFullDate = (date: string) => {
    const hours = date.replace(/([0-9]{4}-[0-9]{2}-[0-9]{2} )/g, '')
    return formatDate(date) + ' ' + hours
}

export const arrondir = (A: number, B: number) => {
    // @ts-ignore
    return parseFloat(parseInt(A * Math.pow(10, B) + .5) / Math.pow(10, B));
}
export const format_size = (S: number) => {
    let $unit = 'B';
    let $d = 0;
    if(S >= Math.pow(1024, 4)) {
        $d = 4;
        $unit = 'TB';
    } else if(S >= Math.pow(1024, 3)) {
        $d = 3;
        $unit = 'GB';
    } else if(S >= Math.pow(1024, 2)) {
        $d = 2;
        $unit = 'MB';
    } else if(S >= Math.pow(1024, 1)) {
        $d = 1;
        $unit = 'KB';
    }
    return arrondir(S / Math.pow(1024, $d), 2) + ' ' + $unit;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const customGenerationFunction = () => (Math.random().toString(36) + '00000000000').substring(2, 16)

export const getCurrency = (amount: number|undefined) => {
    // let euroGerman = new Intl.NumberFormat("de-DE", {
    //     style: "currency",
    //     currency: "EUR",
    // });
    // return euroGerman.format(amount)
    return amount!=undefined?amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "):0;
}

/*
export const requestPermissions = async (file: string, title?: string) => {
    try {
        if(Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'File',
                  message:
                    'App needs access to your Files... ',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('startDownload...');
                downloadFile(file, title)
            }
        } else {
            downloadFile(file, title)
        }
    } catch(e) {
        console.log(e)
    }
}*/

/*
const downloadFile = (file: string, title?: string) => {
    console.log(file)
    try {
        // const response = await 
        RNFetchBlob.config({
            fileCache: true,
            overwrite: true,
            indicator: true,
            addAndroidDownloads: {
                notification: true,
                description: 'Download file...',
                useDownloadManager: true,
                title: title
            },
        })
        .fetch('GET', file, {
            Authorization : 'Bearer access-token...',
            'Content-Type': 'application/octet-stream' //'BASE64' 
            // more headers  ..
        })
        // .uploadProgress((written, total) => {
        //     console.log('Upload: ', written/total)
        // })
        .progress((received, total) => {
            console.log('Progress: ', received/total)
        })
        .then((res) => {
            const status = res.info().status;
            if(status === 200) {
                console.log('Ress : ', res)
                console.log('This is file saved to ', res.path())
                // the conversion is done in native code
                let base64Str = res.base64()
                // the following conversions are done in js, it's SYNC
                let text = res.text()
                let json = res.json()
            }
        })
        // @ts-ignore
        .catch((errorMessage, statusCode) => {
            console.log('statusCode: ', statusCode)
            console.log('errorMessage: ', errorMessage)
        })
        // console.log('ResponseFetchBlob : ', response)
        // console.log('ResponseStatusFetchBlob : ', response.respInfo.status)
    } catch(e) {
        console.log('Error')
    }
}
*/

export const freqs = [
    {
        label: 'Semaines',
        key: getRandomInt(1, 100)
    },
    {
        label: 'Mois',
        key: getRandomInt(1, 100)
    }
];

export const headers = {
    'Accept': 'application/json',
    'content-type': 'multipart/form-data'
}

export const account = 'passager';

export const componentPaddingHeader = 0;

export const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const PRODUCTION = true;

export const baseUri = PRODUCTION ? 'https://app.waataxi.com' : 'http://192.168.8.101:8888/projects/app.waataxi.com';

export const fetchUri = baseUri + '/mobile/v2/request-passager.php';