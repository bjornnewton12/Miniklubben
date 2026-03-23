namespace Minigolf.Application.DTOs;

/// <summary>
/// DTO representing a friendship, used in user-facing endpoints
/// </summary>

public sealed record FriendshipDto(
    Guid Id,
    Guid RequesterId,
    Guid AddresseeId,
    string Status,
    DateTime CreatedAt
    );