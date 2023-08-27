import React from 'react';
import { Icon } from '@rneui/themed';

interface IconSocialProps {
    iconName: string,
    iconColor: string,
    onPress?: any,
    iconSize?: number
    iconType?: string
}

const IconSocial: React.FC<IconSocialProps> = ({iconName, iconColor, iconSize = 20, iconType = 'font-awesome', onPress = () => {console.info('Un click')}}) => {

    return (
        <Icon
            reverse
            raised
            solid
            name={iconName}
            type={iconType}
            size={iconSize}
            color={iconColor}
            onPress={onPress} />
    )
}

export default IconSocial;