export async function addToGamesList(
    data: {
        game_id: string;
        player1: string;
        player2: string;
    },
    game: any
) {
    let games = game.currentGames;
    let index = games.findIndex(
        (element: any) => element.game_id === data.game_id
    );
    if (index === -1) {
        games.push(data);
        game.setCurrentGames(games);
    }
}
