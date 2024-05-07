import React from 'react';

import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

import { useUpdate } from './context';

export interface ConfirmDialogHorizontalButtonsProps {
    /**
     * The function to call when the confirm button is pressed
     */
    onConfirm: () => void;

    /**
     * The text to display on the confirm button
     * @default 'Yes'
     */
    confirmText?: string;

    /**
     * The text to display on the cancel button
     * @default 'No'
     */
    cancelText?: string;

    /**
     * The color of the confirm button
     * @default '$textSuccess'
     */
    confirmColor?: keyof typeof Colors;

    /**
     * The color of the cancel button
     * @default '$textDefault'
     */
    cancelColor?: keyof typeof Colors;
}

export const HorizontalButtons = ({
    onConfirm,
    cancelText = 'No',
    confirmText = 'Yes',
    cancelColor = '$textDanger',
    confirmColor = '$textSuccess',
}: ConfirmDialogHorizontalButtonsProps) => {
    const update = useUpdate();

    const handleClose = () => update({ visible: false });

    const handleConfirm = () => {
        handleClose();
        onConfirm();
    };

    return (
        <View row marginT-s10>
            <TouchableOpacity onPress={handleClose} center style={{ width: '50%' }}>
                <Text text80H {...{ [cancelColor]: true }}>
                    {cancelText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleConfirm}
                center
                style={{
                    width: '50%',
                    borderLeftWidth: 1,
                    borderLeftColor: Colors.$backgroundNeutral,
                }}
            >
                <Text text80H {...{ [confirmColor]: true }}>
                    {confirmText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
HorizontalButtons.displayName = 'ConfirmDialog.HorizontalButtons';
