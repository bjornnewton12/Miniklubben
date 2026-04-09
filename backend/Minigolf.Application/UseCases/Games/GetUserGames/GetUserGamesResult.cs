using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Games.GetUserGames;

public sealed record GetUserGamesResult(bool Success, List<UserGameSummaryDto>? Games, string? Error)
{
    public static GetUserGamesResult Ok(List<UserGameSummaryDto> games) =>
        new(true, games, null);
    public static GetUserGamesResult Fail(string error) => 
        new(false, null, error);
}