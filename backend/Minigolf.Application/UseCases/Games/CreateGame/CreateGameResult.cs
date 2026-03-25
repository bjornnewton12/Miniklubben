using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Games.CreateGame;

public sealed record CreateGameResult(bool Success, GameDto? Game, string? Error)
{
    public static CreateGameResult Ok(GameDto? game) =>
        new(true, game, null);

    public static CreateGameResult Fail(string error) =>
        new(false, null, error);
}