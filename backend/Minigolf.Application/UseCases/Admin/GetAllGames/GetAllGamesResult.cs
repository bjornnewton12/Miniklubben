namespace Minigolf.Application.UseCases.Admin.GetAllGames;

public sealed record AdminGameDto(Guid Id, string CourseName, DateTime? CompletedAt, List<string> PlayerNames);

public sealed record GetAllGamesResult(bool Success, List<AdminGameDto> Games, string? Error)
{
    public static GetAllGamesResult Ok(List<AdminGameDto> games) => new(true, games, null);
    public static GetAllGamesResult Fail(string error) => new(false, [], error);
}
