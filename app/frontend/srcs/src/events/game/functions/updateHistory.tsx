export async function updateHistory(
    data: {
        winner: string;
        loser: string;
        winner_score: number;
        loser_score: number;
        rank: number;
    },
    user: any
) {
    let history = user.gameHistory;
    history.push(data);
    user.setGamehistory(history);
    let ratio = user.winRatio;
    if (data.winner === user.username) {
        ratio.victory++;
    } else {
        ratio.defeat++;
    }
    user.setWinRatio(ratio);
    user.setRank(data.rank);
}
