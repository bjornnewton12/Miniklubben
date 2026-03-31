namespace Minigolf.Application.DTOs;

public sealed record FriendRequestDto(
    Guid FriendshipId,
    Guid RequesterId,
    string Username,
    string AvatarId,
    string? TopColor
    );
