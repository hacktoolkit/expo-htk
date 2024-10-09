export function pluralize(
    word: string,
    count: number,
    customSuffix: string = '',
): string {
    let pluralWord = word;

    if (count !== 1) {
        if (customSuffix) {
            pluralWord += customSuffix;
        } else {
            const lastChar = word.charAt(word.length - 1);
            const lastTwoChars = word.slice(-2);
            let suffix = 's';

            if (
                ['s', 'x', 'z'].includes(lastChar) ||
                ['sh', 'ch'].includes(lastTwoChars)
            ) {
                suffix = 'es';
            } else if (
                lastChar === 'y' &&
                !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))
            ) {
                pluralWord = word.slice(0, -1) + 'i';
                suffix = 'es';
            }
            pluralWord += suffix;
        }
    }

    return pluralWord;
}

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

