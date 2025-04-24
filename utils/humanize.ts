import Humanize from 'humanize-plus';

/**
 * Humanizes large numbers by converting them to a more readable format with suffixes
 * TODO: move to bawshuman-js-common or expo-htk.
 * @param value The number to format
 * @param decimals Number of decimal places to show
 * @returns Formatted string like '1.2 M' or '123,456'
 */
export function formatNumber(
    value: number,
    compactLargeNumbers: boolean = true
): string {
    let result;
    if (value > 1e6 && compactLargeNumbers) {
        // compact representation
        result = Humanize.compactInteger(value);
    } else {
        // formatted number with commas
        result = Humanize.intComma(value);
    }
    return result;
}
