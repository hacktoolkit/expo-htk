import React, { useState, useRef } from 'react';
import { Modal, TouchableOpacity, Text, Dimensions, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native-ui-lib';
import { AppSettingsEntryBase, type AppSettingsEntryBaseProps } from './Base';
import { ScrollView } from 'react-native-gesture-handler';

export interface AppSettingsModalFontFamilyProps<TSettings extends Record<string, any>>
    extends Omit<AppSettingsEntryBaseProps, 'children'> {
    field: keyof TSettings;
    value: string;
    options: string[];
    dispatch: (field: keyof TSettings, value: any) => void;
}

export function AppSettingsModalFontFamily<TSettings extends Record<string, any>>({
    field,
    value,
    options,
    dispatch,
    ...props
}: AppSettingsModalFontFamilyProps<TSettings>) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const modalButtonRef = useRef(null);

    const handleOptionSelect = (selectedOption: string) => {
        dispatch(field, selectedOption);
        setModalVisible(false);
    };

    const showModal = () => {
        modalButtonRef.current?.measure((fx, fy, width, height, px, py) => {
            const screenHeight = Dimensions.get('window').height;
            const positionY = py + height + 10; // 10 for some padding

            // Ensure the modal doesn't go off the screen
            const modalTop = (positionY + 150 > screenHeight) ? py - 150 : positionY;

            setModalPosition({
                top: modalTop,
                left: px + width / 2 - 235, // Center the modal relative to the button
            });
            setModalVisible(true);
        });
    };

    const handleOverlayPress = () => {
        setModalVisible(false);
    };

    return (
        <AppSettingsEntryBase onPress={showModal} {...props}>
            <View ref={modalButtonRef} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{color: Colors.$textPrimary}}>
                    {value || 'Choose Option'}
                </Text>
                <Ionicons
                    name="chevron-down-outline"
                    size={24}
                    color={Colors.$textPrimary}
                />
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={handleOverlayPress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={[styles.modalWrapper, { top: modalPosition.top, left: modalPosition.left }]}>
                    <View style={styles.caret} />
                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select an Option</Text>
                        {options.map((option, index) => (
                            <TouchableOpacity key={index} onPress={() => handleOptionSelect(option)} style={styles.option}>
                                <Text style={[styles.optionText, { fontFamily: option }]}>{option}</Text>
                                {option === value && <Ionicons name="checkmark" size={24} class='text-lame-300' />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </AppSettingsEntryBase>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalWrapper: {
        position: 'absolute',
        alignItems: 'center',
        width: 300,
    },
    modalContent: {
        backgroundColor: Colors.$backgroundDefault,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        width: 250,
        height: 300,
    },
    caret: {
        position: 'absolute',
        top: -10, // Position above the modal
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30,
    },
    option: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.$textDisabled,
        marginBottom: 5,
    },
    optionText: {
        fontSize: 18,
        marginBottom: 5,
    },
    cancelText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});
