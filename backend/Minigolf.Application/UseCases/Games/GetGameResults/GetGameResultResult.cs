using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Games.GetGameResults;

public sealed record GetGameResultResult(bool Success, List<GamePlayerDto>? Players, string? Error)
{
    public static GetGameResultResult Ok(List<GamePlayerDto> players) =>
        new(true, players, null);

    public static GetGameResultResult Fail(string error) =>
        new(false, null, error);
}
