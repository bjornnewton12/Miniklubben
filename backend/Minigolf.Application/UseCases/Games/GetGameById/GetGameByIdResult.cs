using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Games.GetGameById;

public sealed record GetGameByIdResult(bool Success, GameDto? Game, string? Error)
{
    public static GetGameByIdResult Ok(GameDto game) =>
        new(true, game, null);

    public static GetGameByIdResult Fail(string error) =>
        new(false, null, error);
}