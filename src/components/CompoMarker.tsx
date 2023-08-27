import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import RNMarker from './RNMarker';
import { ImageStyle } from 'react-native';

interface CompoMarkerProps {
    coords: Object,
    source?: any,
    imageStyle?: ImageStyle,
    title?: string,
    description?: string
}
const CompoMarker: React.FC<CompoMarkerProps> = ({coords, source, title, description, imageStyle}) => {
    // show description
    const [visible, setVisible] = useState(false)
    return (
        <Marker 
            tracksInfoWindowChanges={true}
            // ref={markerRef}
            // image={imageMapPath.icCar}
            // @ts-ignore
            coordinate={coords}
            // title={'Destination'} 
            // description={endAddress}
            onPress={() => setVisible(!visible)}
            style={{ transform: [{translateY: (visible?-52:-15)}] }}
        >
            <RNMarker visible={visible} title={title} description={description} src={source} imageStyle={imageStyle} />
        </Marker>
    )
}

export default CompoMarker;