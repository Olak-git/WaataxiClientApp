import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform, Dimensions} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

var WINDOW_HEIGHT = Dimensions.get('window').height;

type BottomSheetCopieProps = {
    children?: React.ReactNode;
};
  
export type BottomSheetCopieRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
};

const RNBottomSheetCopie = React.forwardRef<BottomSheetCopieRefProps, BottomSheetCopieProps>(({ children }, ref) => {

    WINDOW_HEIGHT = useWindowDimensions().height;

    const MAX_TRANSLATE_Y = -WINDOW_HEIGHT + 50;

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const context = useSharedValue({ y: 0 });
    
    const gesture = Gesture.Pan()
                                .onStart(() => {
                                    context.value = { y: translateY.value };
                                })
                                .onUpdate(event => {
                                    translateY.value = event.translationY + context.value.y;
                                    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
                                }).onEnd(() => {
                                    if(translateY.value > -WINDOW_HEIGHT/5) {
                                        translateY.value = withSpring(-30, {damping: 50});
                                    } else if(translateY.value < -WINDOW_HEIGHT/1.5) {
                                        translateY.value = withSpring(MAX_TRANSLATE_Y, {damping: 50});
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

    useEffect(() => {
        translateY.value = withSpring(-WINDOW_HEIGHT / 3, {damping: 50});
    }, [])

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, {height: WINDOW_HEIGHT}, rBottomSheetStyle]}>
                <View style={styles.line} />
                {children}
            </Animated.View>
        </GestureDetector>
    )
});

const styles = StyleSheet.create({
    bottomSheetContainer: {
        top: WINDOW_HEIGHT,
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

export default RNBottomSheetCopie;