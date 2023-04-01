export function logout(user: any) {
    user.setIsForcedLogout(true);
    user.setStatus("offline");
}
