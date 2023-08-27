import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ColorsEncr } from '../assets/styles';
import { RNPModal } from './RNPModal';

interface ModalValidationFormProps {
    showModal: boolean
}
export const ModalValidationForm: React.FC<ModalValidationFormProps> = (props) => {
    
    const { showModal } = props;
    
    return (
        <RNPModal showModal={showModal}>
            <View style={[ {flex: 1, justifyContent: 'center', alignItems: 'center'} ]}>
                <ActivityIndicator
                    size={'small'}
                    color={ColorsEncr.main}
                    animating />
            </View>
        </RNPModal>
    )
}