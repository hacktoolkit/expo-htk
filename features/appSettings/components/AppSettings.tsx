import { View } from 'react-native-ui-lib';
import { AppSettingsContainer } from './Container';
import { AppSettingsState } from '../types';
import { AppSettingsEntryFontSize, AppSettingsEntrySwitch } from './Entries';
import React from 'react';

export interface AppSettingsProps<TSettings extends Record<string, any>> {
    hook: () => AppSettingsState<TSettings>;
    sections: AppSettingsSection<TSettings>[];
}

export interface AppSettingsSection<TSettings extends Record<string, any>> {
    title?: string;
    items: AppSettingsSectionItem<TSettings>[];
}

export interface AppSettingsSectionItem<TSettings extends Record<string, any>> {
    field: keyof TSettings;
    component: 'switch' | 'font-size';
    title: string;
    description?: string;
}

export function AppSettings<TSettings extends Record<string, any>>({
    hook,
    sections,
}: AppSettingsProps<TSettings>) {
    const settings = hook();

    const renderSections = sections.map((section, index) => {
        const renderItems = section.items.map(
            ({ field, component, ...item }, index) => {
                let rendered = null;
                if (component === 'switch') {
                    rendered = (
                        <AppSettingsEntrySwitch<TSettings>
                            field={field}
                            value={settings[field]}
                            dispatch={settings.dispatch}
                            {...item}
                        />
                    );
                } else if (component === 'font-size') {
                    rendered = (
                        <AppSettingsEntryFontSize<TSettings>
                            field={field}
                            value={settings[field]}
                            dispatch={settings.dispatch}
                            {...item}
                        />
                    );
                }

                return (
                    <React.Fragment key={field.toString()}>
                        {rendered}
                        {index < section.items.length - 1 && (
                            <View height={1} bg-$backgroundNeutral />
                        )}
                    </React.Fragment>
                );
            },
        );
        return (
            <AppSettingsContainer key={index.toString()} title={section.title}>
                {renderItems}
            </AppSettingsContainer>
        );
    });

    return <View>{renderSections}</View>;
}
