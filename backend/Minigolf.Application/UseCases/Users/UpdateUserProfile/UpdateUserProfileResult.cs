namespace Minigolf.Application.UseCases.Users.UpdateUserProfile;

public sealed record UpdateUserProfileResult(bool Success, string? Error)
{
    public static UpdateUserProfileResult Ok() => new(true, null);
    public static UpdateUserProfileResult Fail(string error) => new(false, error);
}
