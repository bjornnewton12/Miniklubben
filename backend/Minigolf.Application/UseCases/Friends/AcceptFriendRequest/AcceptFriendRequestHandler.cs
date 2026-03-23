using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Friends.AcceptFriendRequest;

public sealed class AcceptFriendRequestHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<AcceptFriendRequestResult> HandleAsync(AcceptFriendRequestCommand cmd)
    {
        var friendship = await friendshipRepository.GetByIdAsync(cmd.FriendshipId);
        if (friendship == null)
            return AcceptFriendRequestResult.Fail("Friend request not found");

        if (friendship.AddresseeId != cmd.UserId)
            return AcceptFriendRequestResult.Fail("Unauthorized");

        if (friendship.Status != "pending")
            return AcceptFriendRequestResult.Fail("Friend request already accepted");

        friendship.Status = "accepted";
        await friendshipRepository.UpdateAsync(friendship);

        var dto = new FriendshipDto(friendship.Id, friendship.RequesterId, friendship.AddresseeId, friendship.Status, friendship.CreatedAt);

        return AcceptFriendRequestResult.Ok(dto);
    }
}