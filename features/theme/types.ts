type ModifiableComponent = 'Text' | 'View' | 'Button';

export interface HtkConfigTheme {
    theme: {
        enabled: boolean;
        ignoreSystemMode: boolean;
        supportDarkMode: boolean;
        defaultScheme: 'light' | 'dark';
        schemes: Schemes;
        colors?: Record<string, string>;
        spacings?: Record<string, number>;
        componentDefaults?: Record<ModifiableComponent, Record<string, any>>;
    };
}

export interface Schemes {
    light: Record<string, string>;
    dark: Record<string, string>;
}
