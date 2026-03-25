using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Games.GetGameById;

public sealed class GetGameByIdHandler(IGameRepository gameRepository)
{
    public async Task<GetGameByIdResult> HandleAsync(GetGameByIdQuery query)
    {
        var game = await gameRepository.GetByIdAsync(query.Id);
        if (game == null)
            return GetGameByIdResult.Fail("Game not found");

        var dto = new GameDto(
            game.Id,
            game.CourseId,
              game.HolesPlayed,
              game.CreatedBy,
              game.Status,
              game.CreatedAt,
              game.CompletedAt,
              game.Players.Select(p => new GamePlayerDto(p.Id, p.GameId, p.UserId, p.GuestName, p.FinalScore, p.Rank)).ToList()
            );

        return GetGameByIdResult.Ok(dto);

    }
}