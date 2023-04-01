export async function updateGameMenu(
    data: {
        menu: string;
        countDown: number;
    },
    game: any
) {
    game.setMenu(data.menu);
    if (data.countDown !== undefined) {
        game.setCountDown(data.countDown);
    }
}
