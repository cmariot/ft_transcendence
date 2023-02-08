export function getCookie(key: string): string {
    var value = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    if (value) {
        return value.toString();
    } else {
        return "";
    }
}
