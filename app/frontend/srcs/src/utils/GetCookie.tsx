export function getCookie(key: string): string | undefined {
    var value = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return value ? value.toString() : undefined;
}
