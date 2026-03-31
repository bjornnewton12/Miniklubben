using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Friends.GetFriendRequests;

public sealed class GetFriendRequestsHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<GetFriendRequestsResult> HandleAsync(GetFriendRequestsQuery query)
    {
        var requests = await friendshipRepository.GetPendingRequestsAsync(query.UserId);

        var dtos = requests.Select(f =>
        {
            var topColor = f.Requester.ColorRankings.OrderBy(r => r.Rank).FirstOrDefault()?.Color.HexValue;
            return new FriendRequestDto(f.Id, f.Requester.Id, f.Requester.Username, f.Requester.AvatarId, topColor);
        }).ToList();

        return GetFriendRequestsResult.Ok(dtos);
    }
}
