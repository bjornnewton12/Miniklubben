namespace Minigolf.Application.UseCases.Friends.RemoveFriend;

public sealed record RemoveFriendCommand(
    Guid FriendshipId,
    Guid UserId
    );