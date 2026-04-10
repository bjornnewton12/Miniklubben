using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Games.SubmitScores;

public sealed class SubmitScoresHandler(IGameRepository gameRepository)
{
    public async Task<SubmitScoresResult> HandleAsync(SubmitScoresCommand cmd)
    {
        var game = await gameRepository.GetByIdAsync(cmd.GameId);
        if (game == null)
            return SubmitScoresResult.Fail("Game not found.");

        if (game.CreatedBy != cmd.SubmittedBy)
            return SubmitScoresResult.Fail("Only the game creator can submit scores");

        if (game.Status != "in_progress")
            return SubmitScoresResult.Fail("Game is already completed");

        // Save scores
        foreach (var scoreInput in cmd.Scores)
        {
            var player = game.Players.FirstOrDefault(p => p.Id == scoreInput.GamePlayerId);

            if (player == null)
                return SubmitScoresResult.Fail($"{scoreInput.GamePlayerId} not found in this game");

            player.Scores.Add(new Score
            {
                GamePlayerId = player.Id,
                HoleNumber = scoreInput.HoleNumber,
                Strokes = scoreInput.Strokes
            });
        }

        // Total score
        foreach (var player in game.Players)
            player.FinalScore = player.Scores.Sum(s => s.Strokes);

        // Rankings (tied scores get the same rank)
        var ranked = game.Players.OrderBy(p => p.FinalScore).ToList();
        for (int i = 0; i < ranked.Count; i++)
        {
            int rank = i + 1;
            if (i > 0 && ranked[i].FinalScore == ranked[i - 1].FinalScore)
                rank = ranked[i - 1].Rank!.Value;
            ranked[i].Rank = rank;
        }

        // Complete game
        game.Status = "completed";
        game.CompletedAt = DateTime.UtcNow;

        // Save
        await gameRepository.UpdateAsync(game);
        return SubmitScoresResult.Ok();
    }
}
