namespace Minigolf.Application.UseCases.Friends.AcceptFriendRequest;

public sealed record AcceptFriendRequestCommand(
    Guid FriendshipId,
    Guid UserId
    );
