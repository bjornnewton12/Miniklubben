using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Friends.GetFriends;

public sealed record GetFriendsResult(bool Success, List<FriendshipDto>? Friendships, string? Error)
{
    public static GetFriendsResult Ok(List<FriendshipDto> friendships) =>
        new(true, friendships, null);

    public static GetFriendsResult Fail(string error) =>
        new(false, null, error);
}