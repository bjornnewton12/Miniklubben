using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Friends.GetFriends;

public sealed class GetFriendsHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<GetFriendsResult> HandleAsync(GetFriendsQuery query)
    {
        var friendships = await friendshipRepository.GetAcceptedFriendsAsync(query.UserId);

        var dtos = friendships.Select(f =>
        {
            var friend = f.RequesterId == query.UserId ? f.Addressee : f.Requester;
            
            var rankingDtos = friend.ColorRankings
                .OrderBy(r => r.Rank)
                .Select(r => new ColorDto(r.Color.Id, r.Color.Name, r.Color.HexValue))
                .ToList();

            var topColor = rankingDtos.FirstOrDefault()?.HexValue;

            return new FriendDto(f.Id, friend.Id, friend.Username, friend.FirstName, friend.Surname, friend.AvatarId, topColor, rankingDtos);
        }).ToList();

        return GetFriendsResult.Ok(dtos);
    }
}