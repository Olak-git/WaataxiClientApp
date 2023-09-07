// import { Dialog, Toast, ALERT_TYPE, Root } from 'react-native-alert-notification';
import { Platform, PermissionsAndroid, Linking, Alert } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { getRandomInt } from "./functions";

export const customGenerateRandomNumber = (length = 4) => (Math.random().toString(10) + '00000000000').substring(2, length+2)

export const customGenerateRandomCharacter = (length = 4) => (Math.random().toString(36) + '00000000000').substring(2, length+2)

export const getErrorsToString = (errors) => {
    let txt = '';
    if(typeof errors == 'object') {
        const l = Object.keys(errors).length - 1;
        let i = 0;
        for(let k in errors) {
            if(txt) txt += '\n';
            txt += '-' + errors[k];
            // txt += '-' + k.replace(/_/g, ' ').replace(/(nb )|( prov)/g, '').replace(/km/g, 'distance') + ': ' + errors[k];
        }
    } else {
        txt = errors;
    }
    return txt;
}

export const generateNewOtpCode = () => new Promise(async (resolve, reject) => {
    resolve(getRandomInt(10000, 99999));
})

const MONTH = ['jan', 'fév', 'mar', 'avr', 'mai', 'ju', 'jui', 'août', 'sep', 'oct', 'nov', 'déc'];

export const getLocalDate = (date) => {
    const _date = date.split(' ')[0];
    const explode = _date.split('-');
    const year = explode[0];
    const month = explode[1];
    const dat = explode[2];
    return dat + ' ' + MONTH[parseInt(month) - 1] + ' ' + year;
    return (new Date(date)).toLocaleString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'});
}

export const getLocalTime = (date) => {
    return date.slice(date.split(' ')[0].length + 1, date.length - 3);
    return (new Date(date)).toLocaleString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

export const getLocalTimeStr = (h) => {
    return h.slice(0, h.length - 3);
    return (new Date('2000-00-00 ' + h)).toLocaleString('fr-FR', {hour12: false, hour: '2-digit', minute: '2-digit'});
}

export const getSqlFormatDateTime = (date) => {
    return getSqlFormatDate(date) + ' ' + getSqlFormatTime(date);
}

export const getSqlFormatDate = (date) => {
    return JSON.parse(JSON.stringify(date)).slice(0, 10)
    return (new Date(date)).toLocaleDateString('ko-KR', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/(\. )/g, '/').replace(/\./g, '');
}

export const getSqlFormatTime = (date) => {
    let $time = (new Date(date)).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const reg = /pm/ig;
    const pm = reg.test($time)
    $time = $time.toString().replace(/\s?(am|pm)/ig, '');
    let ar = $time.split(':');
    const hr = pm ? parseInt(ar[0])+12 : ar[0];
    const h = hr.toString().padStart(2, '0');
    const m = ar[1].padStart(2, '0');
    const s = ar[2].padStart(2, '0');
    $time = h+':'+m+':'+s;
    return $time;
}

export const formatChaineHid = (text, face, back) => text.slice(0, face) + text.slice(face, text.length-back).replace(/./g, '*') + text.slice(text.length-back, text.length);

export const format_tel = (tel, _separate=' ') => {
    let V='';
    if(tel) {
        let l = tel.length
        let r2 = l%3
        
        if(r2!=0) {
            V += tel.slice(0, r2) + _separate;
        }
        for (let index = r2; index < tel.length; index+=3) {
            V += tel.slice(index, index+3) + _separate;
        }
    }
    return V.charAt(V.length-1)==_separate ? V.slice(0, V.length-1) : V
}

export const clear_format_tel = (v, _separate=' ') => {
    return v.replaceAll(_separate, '')
}

/**
 * vérifie si la chaine(A) [ou la décomposition en plusieurs sous-chaines] de caractères est contenue dans le B
 * @param {*} A : le mot recherché
 * @param {*} B : le mot principal
 * @returns boolean
 */
export const characters_exists = (A, B) => {
    // A: le mot recherché
    // B: le mot principal
    let _A = translate_character(A)
    let _B = translate_character(B)

    if(A.startsWith("") && A.endsWith('"')) {

        _A = _A.replace(/"/g, '');
        return _B.includes(_A);

    } else {

        let C = _A.split(' ')
        let include = true;
        C.map(c => {
            if(!_B.includes(c)) {
                include = false
            }
        })

        // console.log({ include, A: _A, B: _B });
        return include;
    }
}

/**
 * Format une chaîne de caractères en prenant le soin de remplacer certains caractères par leur équivalent en UTF8
 * @param {*} str 
 * @returns string
 */
export const translate_character = (str) => {
    let new_str = '';

    // str = str.replace(/[äæ]/ig, 'ae');
    // str = str.replace(/[å]/ig, 'aa');
    // str = str.replace(/[öœ]/ig, 'oe');
    // str = str.replace(/[ü]/ig, 'ue');
    // str = str.replace(/[ß]/g, 'ss');

    str = str.replace(/(ĳ)/ig, 'ij');
    str = str.replace(/[àáâäæãåā]/ig, 'a');
    str = str.replace(/[çćč]/ig, 'c');
    str = str.replace(/[èéêëēėę]/ig, 'e');
    str = str.replace(/[îïíīįì]/ig, 'i');
    str = str.replace(/[ł]/ig, 'l');
    str = str.replace(/[ñń]/ig, 'n');
    str = str.replace(/[ôöòóœøōõ]/ig, 'o');
    str = str.replace(/[ßśš]/ig, 's');
    str = str.replace(/[ûüùúū]/ig, 'u');
    str = str.replace(/[ÿ]/ig, 'y');
    str = str.replace(/[žźż]/ig, 'z');

    str = str.replace(/[£]/ig, '');

    return str.toLowerCase();
}

export const clone = (obj) => Object.assign({}, obj);

export const getCurrentLocation = () => 
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position?.coords?.heading,
                };
                resolve(cords);
            },
            error => {
                console.log('Error: ', error)
                reject(error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        )
    })

export const watchCurrentLocation = () => 
    new Promise((resolve, reject) => {
        Geolocation.watchPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                console.log('Error: ', error)
                reject(error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        )
    })

export const locationPermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        try {
            const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
            if(permissionStatus == 'granted') {
                return resolve('granted')
            }
            reject('permission not granted')
        } catch(error) {
            return reject(error)
        }
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Location Permission denied')
    }).catch((error) => {
        console.log('Ask Location permission error: ', error)
    })
})

export const storagePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //     title: 'File',
        //     message:
        //         'App needs access to your Storage Memory... ',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const readPhonePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        {
            title: 'Phone',
            message:
                'App needs access to your Files... ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const cameraPermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Camera Permission denied')
    }).catch((error) => {
        console.log('Ask Camera permission error: ', error)
    })
})

// const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: "Cool Photo App Camera Permission",
//           message:
//             "Cool Photo App needs access to your camera " +
//             "so you can take awesome pictures.",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK"
//         }
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use the camera");
//       } else {
//         console.log("Camera permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

export const openCoordonateOnMap = async (lat, lon, source=null) => {
    const coords = await getCurrentLocation();
    let destination;
    if(lat && lon) {
        destination = `${lat},${lon}`
    } else if(source) {
        destination = encodeURI(source)
    } else {
        destination = `${coords.latitude},${coords.longitude}`
    }
    openUrl(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&zoom=20&center=${destination}`)
}
// export const openCoordonateOnMap = (lat, lng, label=null) => {
//     const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
//     const latLng = `${lat},${lng}`;
//     label = label||'Point de rencontre';
//     const url = Platform.select({
//       ios: `${scheme}${label}@${latLng}`,
//       android: `${scheme}${latLng}(${label})`
//     });
//     openUrl(url)
// }

export const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    
    console.log(`Link pressed: ${url}`);

    if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
    } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
    }
}

export const callPhoneNumber = (number) => {
    const phoneNumber = `${Platform.OS !== 'android' ? 'telprompt' : 'tel'}:${number}`;
    openUrl(phoneNumber);
}



// const hasPermission = async () => {
//     if(Platform.OS == 'android') {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'File',
//               message:
//                 'App needs access to your Files... ',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             return true;
//         }
//     } else {
//         return true;
//     }
//     return false
// }


/*

Maman =  100.000
           5.000
          50.000
          10.000
          10.000
          10.000
      =  185.000

Fofo = 210.000
       100.000
        20.000
         5.000
    =  335.000

T = 185.000
    335.000
  = 520.000

*/