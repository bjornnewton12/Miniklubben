using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Games.GetUserGames;

public sealed class GetUserGamesHandler(IGameRepository gameRepository)
{
    public async Task<GetUserGamesResult> HandleAsync(GetUserGamesQuery query)
    {
        var games = await gameRepository.GetByUserIdAsync(query.UserId);

        var dtos = games.Select(g => new UserGameSummaryDto(
            g.Id,
            g.Course.Name,
            g.Course.Location,
            g.Course.ImageUrl,
            g.CompletedAt,
            g.Players
                .OrderBy(p => p.Rank)
                .Select(p => new UserGamePlayerDto(
                    p.User?.FirstName ?? p.GuestName ?? "Okänd",
                    p.User?.AvatarId ?? "guest",
                    p.AssignedColor?.HexValue,
                    p.FinalScore,
                    p.Rank
                )).ToList()
        )).ToList();

        return GetUserGamesResult.Ok(dtos);
    }
}