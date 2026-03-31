using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Friends.GetFriendRequests;

public sealed record GetFriendRequestsResult(bool Success, List<FriendRequestDto>? Requests, string? Error)
{
    public static GetFriendRequestsResult Ok(List<FriendRequestDto> requests) =>
        new(true, requests, null);

    public static GetFriendRequestsResult Fail(string error) =>
        new(false, null, error);
}
