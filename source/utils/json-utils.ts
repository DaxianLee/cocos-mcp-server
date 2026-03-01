/**
 * Fix common JSON string issues before parsing.
 * Handles unescaped characters, trailing commas, single quotes, and control characters.
 */
export function fixCommonJsonIssues(jsonStr: string): string {
    let fixed = jsonStr;

    fixed = fixed
        // Fix unescaped backslashes
        .replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix single quotes to double quotes
        .replace(/'/g, '"')
        // Fix control characters
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

    return fixed;
}
