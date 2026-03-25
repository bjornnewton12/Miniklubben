namespace Minigolf.Application.UseCases.Games.SubmitScores;

public sealed record SubmitScoresResult(bool Success, string? Error)
{
    public static SubmitScoresResult Ok() =>
        new(true, null);

    public static SubmitScoresResult Fail(string error) =>
        new(false, error);

}
