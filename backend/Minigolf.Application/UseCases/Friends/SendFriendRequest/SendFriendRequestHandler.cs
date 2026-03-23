using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Friends.SendFriendRequest;

public sealed class SendFriendRequestHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<SendFriendRequestResult> HandleAsync(SendFriendRequestCommand cmd)
    {
        var existing = await friendshipRepository.GetExistingAsync(cmd.RequesterId, cmd.AddresseeId);
        if (existing != null)
            return SendFriendRequestResult.Fail("You already have an active friend request");

        var friendship = new Friendship
        {
            RequesterId = cmd.RequesterId,
            AddresseeId = cmd.AddresseeId,
            Status = "pending"
        };

        var saved = await friendshipRepository.CreateAsync(friendship);

        var dto = new FriendshipDto(saved.Id, saved.RequesterId, saved.AddresseeId, saved.Status, saved.CreatedAt);

        return SendFriendRequestResult.Ok(dto);
    }
}