export function truncateWord(text: string, wordCount: number): string {
    const words = text.split(' ');

    return words.length > wordCount
        ? words.slice(0, wordCount).join(' ') + '...'
        : words.join(' ');
}

export function capitalize(name: string): string {
    return `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`;
}

export function snakeCaseToCapitalize(name: string): string {
    return name.split('_').map(capitalize).join(' ');
}

