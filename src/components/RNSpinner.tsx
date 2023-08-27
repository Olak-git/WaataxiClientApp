import React from "react"
import { ActivityIndicator } from "react-native"
import Spinner from "react-native-spinkit"
import tw from 'twrnc'

// type='FadingCircleAlt'
export const RNSpinner: React.FC<{visible: boolean}> = ({visible}) => {
    return visible?<ActivityIndicator color='#c2c2c2' style={tw`mb-2`} />:<></>
    return <Spinner isVisible={visible} type='FadingCircleAlt' size={20} color='#ccc' style={tw`self-center text-center mb-2`} />
}