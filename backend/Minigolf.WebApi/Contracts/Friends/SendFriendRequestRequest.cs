namespace Minigolf.WebApi.Contracts.Friends;

public sealed record SendFriendRequestRequest(
    Guid AddresseeId
    );