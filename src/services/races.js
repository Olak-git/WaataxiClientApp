import { api_ref } from "../functions/functions"

const getResponseJson = (response) => {
    return response.json()
}

const getErrorResponse = (error) => {
    console.log({ error });
}

export function cancelInstantRace(params) {
    return fetch(api_ref + '/cancel_instant_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function cancelReservationCarsharing(params) {
    return fetch(api_ref + '/cancel_reservation_carsharing.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function cancelReservationRace(params) {
    return fetch(api_ref + '/cancel_reservation_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export async function checkAccount(params) {
    console.log({ formData: params.formData, api: api_ref + '/check_account.php' });
    try {
        const response = await fetch(api_ref + '/check_account.php', {
            method: 'POST',
            body: params.formData,
            headers: {
                'Accept': 'application/json',
            }
        });
        console.log({ response });
        return getResponseJson(response);
    } catch (error) {
        throw new Error(error)
        // return getErrorResponse(error);
        // console.log({ error });
    }
}

export function deleteAccount(params) {
    return fetch(api_ref + '/delete_account.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function editProfile(params) {
    return fetch(api_ref + '/edit_profile.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function get_configuration(params) {
    return fetch(api_ref + '/get_configuration.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getDriverRates(params) {
    return fetch(api_ref + '/get_driver_rates.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getInstantRaces(params) {
    return fetch(api_ref + '/get_instant_races.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getModelCars(params) {
    return fetch(api_ref + '/get_model_cars.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getNewCodeForAuthAccount(params) {
    return fetch(api_ref + '/get_new_code_for_auth_account.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function get_notifications(params) {
    return fetch(api_ref + '/get_notifications.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getReservationsAndNewCarsharing(params) {
    return fetch(api_ref + '/get_reservations_and_new_carsharing.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getReservationsInstantRace(params) {
    return fetch(api_ref + '/get_reservations_instant_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function getUserRate(params) {
    return fetch(api_ref + '/get_user_rate.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function newInstantRace(params) {
    return fetch(api_ref + '/new_instant_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function newPassword(params) {
    return fetch(api_ref + '/new_password.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function newReservationCarsharing(params) {
    return fetch(api_ref + '/new_reservation_carsharing.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function newReservationRace(params) {
    return fetch(api_ref + '/new_reservation_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function paymentRace(params) {
    return fetch(api_ref + '/payment_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function refreshHomeScreen(params) {
    return fetch(api_ref + '/refresh_home_screen.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function refreshRace(params) {
    return fetch(api_ref + '/refresh_race.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function sendHelpMessage(params) {
    return fetch(api_ref + '/send_help_message.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function signin(params) {
    return fetch(api_ref + '/signin.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function signup(params) {
    return fetch(api_ref + '/signup.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function updateDriverRate(params) {
    return fetch(api_ref + '/update_driver_rate.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function updateModelCar(params) {
    return fetch(api_ref + '/update_model_car.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data'
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function updatePassword(params) {
    return fetch(api_ref + '/update_password.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function updatePhoneNumber(params) {
    return fetch(api_ref + '/update_phone_number.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}

export function updateWallet(params) {
    return fetch(api_ref + '/update_wallet.php', {
        method: 'POST',
        body: params.formData,
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(getResponseJson)
    .catch(getErrorResponse)
}