namespace Minigolf.Application.UseCases.Users.UpdateColorRankings;

public sealed record UpdateColorRankingsResult(bool Success, string? Error)
{
    public static UpdateColorRankingsResult Ok() => 
        new(true, null);
    public static UpdateColorRankingsResult Fail(string error) =>
        new(false, error);
}
