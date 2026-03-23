using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Friends.RemoveFriend;

public sealed class RemoveFriendHandler(IFriendshipRepository friendshipRepository)
{
    public async Task<RemoveFriendResult> HandleAsync(RemoveFriendCommand cmd)
    {
        var friendship = await friendshipRepository.GetByIdAsync(cmd.FriendshipId);
        if (friendship == null)
            return RemoveFriendResult.Fail("Friendship not found");

        if (friendship.RequesterId != cmd.UserId && friendship.AddresseeId != cmd.UserId)
            return RemoveFriendResult.Fail("Unauthorized");

        await friendshipRepository.DeleteAsync(friendship);

        return RemoveFriendResult.Ok();
    }
}