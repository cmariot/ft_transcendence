export function getCookie(key: string): string {
    var value: any = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return value ? value.pop() : "";
}
