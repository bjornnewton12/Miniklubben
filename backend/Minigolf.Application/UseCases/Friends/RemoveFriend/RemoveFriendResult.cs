namespace Minigolf.Application.UseCases.Friends.RemoveFriend;

public sealed record RemoveFriendResult(bool Success, string? Error)
{
    public static RemoveFriendResult Ok() => 
        new(true, null);

    public static RemoveFriendResult Fail(string error) =>
        new(false, error);
}