import { Platform, StatusBar } from "react-native";
import { windowHeight, windowWidth } from "../functions/functions";

export const statusBarHeight = StatusBar.currentHeight;

export const imageMapPath = {
    mark: 'epingle-carte.png',
    car: 'icon-car.png',
    user: 'localisation-user.png',
    icCar: require('../assets/images/icon-car.png'),
    icUser: require('../assets/images/localisation-user.png'),
    icMapCenter: require('../assets/images/map-center.png')
}

const ASPECT_RATIO = windowWidth / windowHeight;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; //0.0421;

export const waataxi_infos = {
    address: 'Saint Michel, Cotonou, Bénin',
    email: 'contact@waataxi.com',
    phone: '+229 54 61 86 00'
}

export const initCoords = {
    latitude: 6.5113071, 
    longitude: 2.6056209,
}

export const google_maps_apikey = 'AIzaSyB4DkCBwbk7YKbT8lOGsLeTmWu9DvLUqus';

export const otp_authentication = false;

export const account = 'passager';

export const phone_number_test = '42424242';

export const polices = {
    font1: Platform.OS == 'android' ? 'IbarraRealNova-VariableFont_wght' : 'PatrickHand-Regular',
    times_new_roman: Platform.OS == 'android' ? 'times-new-roman' : 'times new roman',
}

export const app_links = {
    ios: 'https://apps.apple.com/bj/app/waa-taxi/id1659290494?l=fr-FR',
    android: 'https://play.google.com/store/apps/details?id=com.waataxiclient'
}