import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform, Dimensions} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import tw from 'twrnc';

const WINDOW_HEIGHT = Dimensions.get('window').height;

type BottomSheetProps = {
    maxHeight?: number,
    callAction?: boolean,
    children?: React.ReactNode;
};
  
export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
};

const RNBottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(({ maxHeight, callAction, children }, ref) => {

    // const WINDOW_HEIGHT = useWindowDimensions().height;

    const MAX_TRANSLATE_Y = -(maxHeight ? (maxHeight > 0 && maxHeight > WINDOW_HEIGHT ? WINDOW_HEIGHT : maxHeight) : WINDOW_HEIGHT) + 50;

    const animatedStyle = maxHeight ? {top: WINDOW_HEIGHT, maxHeight: WINDOW_HEIGHT} : {top: WINDOW_HEIGHT, height: WINDOW_HEIGHT};

    // console.log('animatedStyle: ', animatedStyle);
    
    const translateY = useSharedValue(0);

    const active = useSharedValue(false);

    const context = useSharedValue({ y: 0 });

    const scrollTo = useCallback((destination: number) => {
        'worklet';
        active.value = destination !== 0;
  
        translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
        scrollTo,
        isActive,
    ]);
    
    const gesture = Gesture.Pan()
                                .onStart(() => {
                                    context.value = { y: translateY.value };
                                })
                                .onUpdate(event => {
                                    translateY.value = event.translationY + context.value.y;
                                    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
                                }).onEnd(() => {
                                    if(callAction) {
                                        if(translateY.value > -WINDOW_HEIGHT/3) {
                                            scrollTo(0)
                                        } else if(translateY.value < -WINDOW_HEIGHT/1.5) {
                                            scrollTo(MAX_TRANSLATE_Y);
                                        }
                                    } else {
                                        // console.log('Djefff')
                                        if(translateY.value > -WINDOW_HEIGHT/5) {
                                            translateY.value = withSpring(-90, {damping: 50});
                                        } else if(translateY.value < -WINDOW_HEIGHT/1.5) {
                                            translateY.value = withSpring(MAX_TRANSLATE_Y, {damping: 50});
                                        }
                                    }
                                });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
                                            translateY.value, 
                                            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], 
                                            [25, 5], 
                                            Extrapolate.CLAMP
                                        );
        return {
            borderRadius,
            transform: [{ translateY: translateY.value }]
        }
    })

    useEffect(() => {
        if(callAction) {
            scrollTo(-WINDOW_HEIGHT/3);
        } else {
            translateY.value = withSpring(-WINDOW_HEIGHT / 3, {damping: 50});
        }
    }, [])

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[tw`shadow-2xl`, styles.bottomSheetContainer, animatedStyle, rBottomSheetStyle]}>
                <View style={styles.line} onLayout={(event) => {
                    // console.log('Height: ', event.nativeEvent.layout.height)
                }} />
                {children}
            </Animated.View>
        </GestureDetector>
    )
});

const styles = StyleSheet.create({
    bottomSheetContainer: {
        // top: WINDOW_HEIGHT,
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 25,
        elevation: 10
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2
    }
})

export default RNBottomSheet;