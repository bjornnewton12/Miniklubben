namespace Minigolf.Application.DTOs;
/// <summary>
/// DTO representing a friendship, used in user-facing endpoints
/// </summary>

public sealed record FriendDto(
    Guid FriendshipId,
    Guid UserId,
    string Username,
    string AvatarId,
    string? TopColor,
    List<ColorDto> ColorRankings
    );