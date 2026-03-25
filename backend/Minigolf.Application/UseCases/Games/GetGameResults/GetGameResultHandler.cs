using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Games.GetGameResults;

public sealed class GetGameResultHandler(IGameRepository gameRepository)
{
    public async Task<GetGameResultResult> HandleAsync(GetGameResultQuery query)
    {
        var game = await gameRepository.GetByIdAsync(query.GameId);

        if (game == null)
            return GetGameResultResult.Fail("Game not found");

        if (game.Status != "completed")
            return GetGameResultResult.Fail("Game is not completed");

        var players = game.Players.OrderBy(p => p.Rank)
            .Select(p => new GamePlayerDto(p.Id, p.GameId, p.UserId, p.GuestName, p.FinalScore, p.Rank)).ToList();


        return GetGameResultResult.Ok(players);
    }
}