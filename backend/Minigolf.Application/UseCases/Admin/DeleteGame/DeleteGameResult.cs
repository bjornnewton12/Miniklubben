namespace Minigolf.Application.UseCases.Admin.DeleteGame;

public sealed record DeleteGameResult(bool Success, string? Error)
{
    public static DeleteGameResult Ok() => new(true, null);
    public static DeleteGameResult Fail(string error) => new(false, error);
}
