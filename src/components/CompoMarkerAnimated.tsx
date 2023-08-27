import React, { useEffect, useRef, useState } from 'react';
import { AnimatedRegion, Marker } from 'react-native-maps';
import RNMarker from './RNMarker';
import { ImageStyle, Platform } from 'react-native';
import { LATITUDE_DELTA, LONGITUDE_DELTA, initCoords } from '../data/data';
import { locationPermission, getCurrentLocation } from '../functions/helperFunction';

const timer = require('react-native-timer');

interface CompoMarkerAnimatedProps {
    source?: any,
    imageStyle?: ImageStyle,
    title?: string,
    description?: string,
    mapRef?: any,
    show?: boolean,
    rotate?: number
}
const CompoMarkerAnimated: React.FC<CompoMarkerAnimatedProps> = ({source, imageStyle, title, description, mapRef, show=true, rotate=0}) => {
    const markerRef = useRef(null);
    // show description
    const [visible, setVisible] = useState(false)
    const [currentCoords, setCurrentCoords] = useState({});
    const [heading, setHeading] = useState(0);

    const styles = {transform: [{rotate: `${heading}deg`}], ...imageStyle}

    const DELTA = {
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    }

    const [coordinate, setCoordinate] = useState(new AnimatedRegion({
        ...initCoords,
        ...DELTA
    }))

    const [state, setState] = useState({
        coordinate: new AnimatedRegion({
            ...DELTA
        })
    })

    const onCenter = () => {
        // console.log('Centtt');
        // @ts-ignore
        mapRef.current?.animateToRegion({
            ...currentCoords,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const animate = (latitude: number, longitude: number) => {
        const newCoordinate = {latitude, longitude};

        setCurrentCoords({latitude: latitude, longitude: longitude})

        // console.log('newCoordinate: ', newCoordinate);

        if(Platform.OS == 'android') {
            // @ts-ignore
            markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000)
        } else {
            // @ts-ignore
            coordinate.timing(newCoordinate).start();
        }
    }
    
    const currentCoordonates = async () => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            const response = await getCurrentLocation();
            // console.log('Response: ', response);

            const {latitude, longitude, heading} = response;

            animate(latitude, longitude);

            setHeading(heading-rotate)
            setCoordinate(new AnimatedRegion({
                latitude: latitude,
                longitude: longitude,
                ...DELTA
            }))
        }
    }

    useEffect(() => {
        timer.setInterval('refresh-current-coords', currentCoordonates, 1000)
        return () => {
            if(timer.intervalExists('refresh-current-coords')) timer.clearInterval('refresh-current-coords')
        }
    }, [])

    useEffect(() => {
        // console.log('SHOW: ', show);
        if(show && mapRef) {
            onCenter()
        }
    }, [show, mapRef])

    return (Object.keys(currentCoords).length != 0 && show) ? (
        <Marker.Animated
            ref={markerRef}
            tracksViewChanges={true}
            // tracksInfoWindowChanges={true}
            // image={imageMapPath.icCar}
            // @ts-ignore
            coordinate={coordinate}
            // title={'Destination'} 
            // description={endAddress}
            onPress={() => {
                setVisible(!visible)
            }}
        >
            <RNMarker visible={description!=undefined&&visible} title={title} description={description} src={source} imageStyle={styles} />
        </Marker.Animated>
    ) : (null)
}

export default CompoMarkerAnimated;