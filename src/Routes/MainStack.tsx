import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthView from '../view/Auth/AuthView/AuthView';
import RegisterView from '../view/Auth/RegisterView/RegisterView';
import CourseAddInfosView from '../view/Dashboard/CourseAddInfosView/CourseAddInfosView';
import CourseCovoiturageInfosView from '../view/Dashboard/CourseCovoiturageInfosView/CourseCovoiturageInfosView';
import CourseLoaderView from '../view/Dashboard/CourseLoaderView/CourseLoaderView';
import CovoiturageReservationLoaderView from '../view/Dashboard/CovoiturageReservationLoaderView/CovoiturageReservationLoaderView';
import CurrentPositionView from '../view/Dashboard/CurrentPositionView/CurrentPositionView';
import DetailsCourseView from '../view/Dashboard/DetailsCourseView/DetailsCourseView';
import DetailsNewCovoiturageView from '../view/Dashboard/DetailsCovoiturageView/DetailsNewCovoiturageView';
import DetailsReservationCovoiturageView from '../view/Dashboard/DetailsCovoiturageView/DetailsReservationCovoiturageView';
import DetailsNotificationView from '../view/Dashboard/DetailsNotificationView/DetailsNotificationView';
import DetailsReservationView from '../view/Dashboard/DetailsReservationView/DetailsReservationView';
import EditMyAccountView from '../view/Dashboard/EditMyAccountView/EditMyAccountView';
import FinitionView from '../view/Dashboard/FinitionView/FinitionView';
import FoundLocationView from '../view/Dashboard/FoundLocationView/FoundLocationView';
// import HelpView from '../view/Dashboard/HelpView/HelpView';
import HistoriqueCourseInstantanneeView from '../view/Dashboard/HistoriqueCourseInstantanneeView/HistoriqueCourseInstantanneeView';
import HistoriqueCovoiturageView from '../view/Dashboard/HistoriqueCovoiturageView/HistoriqueCovoiturageView';
import HistoriqueReservationView from '../view/Dashboard/HistoriqueReservationView/HistoriqueReservationView';
// import HomeView from '../view/Dashboard/HomeView/HomeView';
// import MyAccountView from '../view/Dashboard/MyAccountView/MyAccountView';
import NotationConducteurView from '../view/Dashboard/NotationConducteurView/NotationConducteurView';
import NotificationsView from '../view/Dashboard/NotificationsView/NotificationsView';
import PortefeuilleView from '../view/Dashboard/PortefeuilleView/PortefeuilleView';
import ProfilConducteurView from '../view/Dashboard/ProfilConducteurView/ProfilConducteurView';
import ProgramCovoiturageView from '../view/Dashboard/ProgramCovoiturageView/ProgramCovoiturageView';
import ProgramItineraireView from '../view/Dashboard/ProgramItineraireView/ProgramItineraireView';
import UpdatePasswordView from '../view/Dashboard/UpdatePasswordView/UpdatePasswordView';
import UpdateTelView from '../view/Dashboard/UpdateTelView/UpdateTelView';
import PresentationView from '../view/PresentationView/PresentationView';
import WelcomeView from '../view/WelcomeView/WelcomeView';
import { useSelector } from 'react-redux';
import Drawer from './Drawer';
import ResetPasswordView from '../view/Auth/ResetPasswordView/ResetPasswordView';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    const init = useSelector((state: any) => state.init);
    const { presentation, welcome } = init;
    const user = useSelector((state: any) => state.user.data);

    useEffect(()=>{
        console.log('user: ', user)
    }, [user])

    return (
        <Stack.Navigator
            // initialRouteName={ presentation ? 'Home' : 'Presentation' }
            // initialRouteName={ 'Welcome' }
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}>

            {!welcome && (
                <Stack.Group>
                    <Stack.Screen name='Welcome' component={WelcomeView} />
                </Stack.Group>
            )}

            {!presentation && (
                <Stack.Group>
                    <Stack.Screen name='Presentation' component={PresentationView}
                        options={{
                            animation: 'fade_from_bottom'
                        }}
                    />
                </Stack.Group>
            )}

            {Object.keys(user).length == 0
                ?
                <Stack.Group>
                    <Stack.Screen name='Auth' component={AuthView} />
                    <Stack.Screen name='Register' component={RegisterView} />
                    <Stack.Screen name='ResetPassword' component={ResetPasswordView} />
                </Stack.Group>
                :
                <Stack.Group>

                    <Stack.Screen name='Drawer' component={Drawer} />

                    <Stack.Screen name='DashEditMyAccount' component={EditMyAccountView} />
                    <Stack.Screen name='DashUpdateTel' component={UpdateTelView} />
                    <Stack.Screen name='DashUpdatePassword' component={UpdatePasswordView} />
                    <Stack.Screen name='DashPortefeuille' component={PortefeuilleView} />
                    <Stack.Screen name='DashNotifications' component={NotificationsView} />
                    <Stack.Screen name='DashDetailsNotification' component={DetailsNotificationView} />

                    {/* COVOITURAGE */}
                    <Stack.Screen name='DashHistoriqueCovoiturage' component={HistoriqueCovoiturageView} />
                    <Stack.Screen name='DashDetailsReservationCovoiturage' component={DetailsReservationCovoiturageView} />
                    <Stack.Screen name='DashDetailsNewCovoiturage' component={DetailsNewCovoiturageView} />
                    <Stack.Screen name='DashProgramCovoiturage' component={ProgramCovoiturageView} />
                    <Stack.Screen name='DashCourseCovoiturageInfos' component={CourseCovoiturageInfosView} />
                    <Stack.Screen name='DashCourseCovoiturageReservationLoader' component={CovoiturageReservationLoaderView} />

                    {/* COURSE  */}
                    <Stack.Screen name='DashHistoriqueCourseInstantannee' component={HistoriqueCourseInstantanneeView} />
                    <Stack.Screen name='DashDetailsCourse' component={DetailsCourseView} />
                    <Stack.Screen name='DashCourseLoader' component={CourseLoaderView} />

                    {/* RESERVATION */}
                    <Stack.Screen name='DashHistoriqueReservation' component={HistoriqueReservationView} />
                    <Stack.Screen name='DashDetailsReservation' component={DetailsReservationView} />

                    {/* COURSE & RESERVATION */}
                    <Stack.Screen name='DashProgramItineraire' component={ProgramItineraireView} />
                    <Stack.Screen name='DashCourseOtherInfos' component={CourseAddInfosView} />


                    <Stack.Screen name='DashCurrentPosition' component={CurrentPositionView} />

                    <Stack.Screen name='DashFinition' component={FinitionView} />

                    <Stack.Screen name='DashNotationConducteur' component={NotationConducteurView} />


                    <Stack.Screen name='DashFoundLocation' component={FoundLocationView} options={{ animation: 'fade_from_bottom' }} />

                    <Stack.Screen name='DashProfilConducteur' component={ProfilConducteurView} />

                </Stack.Group>
            }

        </Stack.Navigator>
    )
}

export default MainStack