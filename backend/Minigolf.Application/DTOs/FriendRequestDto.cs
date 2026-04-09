namespace Minigolf.Application.DTOs;

public sealed record FriendRequestDto(
    Guid FriendshipId,
    Guid RequesterId,
    string Username,
    string FirstName,
    string Surname,
    string AvatarId,
    string? TopColor
    );
