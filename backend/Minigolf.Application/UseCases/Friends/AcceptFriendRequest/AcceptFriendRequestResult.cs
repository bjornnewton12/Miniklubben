using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Friends.AcceptFriendRequest;

public sealed record AcceptFriendRequestResult(bool Success, FriendshipDto? Friendship, string? Error)
{
    public static AcceptFriendRequestResult Ok(FriendshipDto friendship) =>
        new(true, friendship, null);

    public static AcceptFriendRequestResult Fail(string error) =>
        new(false, null, error);
}