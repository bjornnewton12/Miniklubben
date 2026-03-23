using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Friends.SendFriendRequest;

public sealed record SendFriendRequestResult(bool Success, FriendshipDto? Friendship, string? Error)
{
    public static SendFriendRequestResult Ok(FriendshipDto friendship) =>
        new(true, friendship, null);

    public static SendFriendRequestResult Fail(string error) =>
        new(false, null, error);
}
