import React from 'react';

import { Text as RNText } from 'react-native';
import { Text, TextProps } from 'react-native-ui-lib';

export const Title = React.forwardRef<RNText, TextProps>((props, ref) => (
    <Text ref={ref} text70M {...props} />
));
Title.displayName = 'ConfirmDialog.Title';
