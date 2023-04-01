export async function displayStreamResults(
    data: {
        gameId: string;
        results: {
            winner: string;
            player1: string;
            player2: string;
            p1Score: number;
            p2Score: number;
        };
    },
    game: any
) {
    game.setStreamResults(data.results);
    game.setMenu("StreamResults");
}
