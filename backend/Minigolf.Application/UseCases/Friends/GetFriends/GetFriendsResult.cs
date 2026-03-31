using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Friends.GetFriends;

public sealed record GetFriendsResult(bool Success, List<FriendDto>? Friends, string? Error)
{
    public static GetFriendsResult Ok(List<FriendDto> friends) =>
        new(true, friends, null);

    public static GetFriendsResult Fail(string error) =>
        new(false, null, error);
}