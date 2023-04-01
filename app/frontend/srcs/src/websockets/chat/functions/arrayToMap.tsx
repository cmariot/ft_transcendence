export function arrayToMap(array: Array<any>) {
    let map = new Map<string, { channelName: string; channelType: string }>();
    for (let i = 0; i < array.length; i++) {
        if (array[i].channelName) {
            map.set(array[i].channelName, array[i]);
        }
    }
    return map;
}
