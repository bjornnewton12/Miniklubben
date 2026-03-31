namespace Minigolf.Application.UseCases.Admin.DeleteUser;

public sealed record DeleteUserResult(bool Success, string? Error)
{
    public static DeleteUserResult Ok() => new(true, null);
    public static DeleteUserResult Fail(string error) => new(false, error);
}
