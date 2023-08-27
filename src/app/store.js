import { configureStore, combineReducers } from "@reduxjs/toolkit";
import picturesReducer from '../feature/picture.slice';
import userReducer from '../feature/user.slice';
import switchNotificationReducer from '../feature/switch.notification.slice';
import avatarReducer from '../feature/avatar.slice';
import drawerReducer from '../feature/drawer.slice';
import focusedReducer from '../feature/focused.slice';
import initReducer from '../feature/init.slice';
import dialogReducer from '../feature/dialog.slice';
import reloadReducer from '../feature/reload.slice';
import notificationsReducer from '../feature/notifications.slice';
import notationReducer from '../feature/notation.slice';
import authTelReducer from "../feature/auth.tel.slice";
import coursesReducer from "../feature/courses.slice";
import { persistReducer } from "redux-persist";
import thunk from 'redux-thunk';
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // whitelist: ['user']
}

const reducers = combineReducers({
    init: initReducer,
    dialog: dialogReducer,
    reload: reloadReducer,
    notifications: notificationsReducer,
    notation: notationReducer,
    pictures: picturesReducer,
    user: userReducer,
    switch_notification: switchNotificationReducer,
    avatar: avatarReducer,
    drawer: drawerReducer,
    focused: focusedReducer,
    auth_tel: authTelReducer,
    courses: coursesReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV != 'production',
    middleware: [thunk]
})

export default store
