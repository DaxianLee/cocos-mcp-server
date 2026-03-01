"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixCommonJsonIssues = fixCommonJsonIssues;
/**
 * Fix common JSON string issues before parsing.
 * Handles unescaped characters, trailing commas, single quotes, and control characters.
 */
function fixCommonJsonIssues(jsonStr) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS91dGlscy9qc29uLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsa0RBZ0JDO0FBcEJEOzs7R0FHRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLE9BQWU7SUFDL0MsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBRXBCLEtBQUssR0FBRyxLQUFLO1FBQ1QsNEJBQTRCO1NBQzNCLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxVQUFVLENBQUM7UUFDbEQsc0JBQXNCO1NBQ3JCLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDO1FBQzlCLHFDQUFxQztTQUNwQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUNuQix5QkFBeUI7U0FDeEIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7U0FDckIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7U0FDckIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUUzQixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaXggY29tbW9uIEpTT04gc3RyaW5nIGlzc3VlcyBiZWZvcmUgcGFyc2luZy5cbiAqIEhhbmRsZXMgdW5lc2NhcGVkIGNoYXJhY3RlcnMsIHRyYWlsaW5nIGNvbW1hcywgc2luZ2xlIHF1b3RlcywgYW5kIGNvbnRyb2wgY2hhcmFjdGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpeENvbW1vbkpzb25Jc3N1ZXMoanNvblN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgZml4ZWQgPSBqc29uU3RyO1xuXG4gICAgZml4ZWQgPSBmaXhlZFxuICAgICAgICAvLyBGaXggdW5lc2NhcGVkIGJhY2tzbGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXFxcXSlcXFxcKFteXCJcXFxcXFwvYmZucnR1XSkvZywgJyQxXFxcXFxcXFwkMicpXG4gICAgICAgIC8vIEZpeCB0cmFpbGluZyBjb21tYXNcbiAgICAgICAgLnJlcGxhY2UoLywoXFxzKlt9XFxdXSkvZywgJyQxJylcbiAgICAgICAgLy8gRml4IHNpbmdsZSBxdW90ZXMgdG8gZG91YmxlIHF1b3Rlc1xuICAgICAgICAucmVwbGFjZSgvJy9nLCAnXCInKVxuICAgICAgICAvLyBGaXggY29udHJvbCBjaGFyYWN0ZXJzXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKVxuICAgICAgICAucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpO1xuXG4gICAgcmV0dXJuIGZpeGVkO1xufVxuIl19