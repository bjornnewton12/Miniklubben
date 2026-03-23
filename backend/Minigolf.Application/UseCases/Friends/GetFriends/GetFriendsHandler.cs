using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Friends.GetFriends;

public sealed class GetFriendsHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<GetFriendsResult> HandleAsync(GetFriendsQuery query)
    {
        var friendships = await friendshipRepository.GetAcceptedFriendsAsync(query.UserId);

        var dtos = friendships.Select(f => new FriendshipDto(
            f.Id,
            f.RequesterId,
            f.AddresseeId,
            f.Status,
            f.CreatedAt
            )).ToList();

        return GetFriendsResult.Ok(dtos);
    }
}