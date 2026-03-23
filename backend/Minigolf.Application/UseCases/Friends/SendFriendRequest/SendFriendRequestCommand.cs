namespace Minigolf.Application.UseCases.Friends.SendFriendRequest;

public sealed record SendFriendRequestCommand(
    Guid RequesterId,
    Guid AddresseeId
    );