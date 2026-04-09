namespace Minigolf.Application.DTOs;

/// <summary>
/// DTO representing a user, used in user-facing endpoints
/// </summary>
public sealed record UserDto(
    Guid Id,
    string Username,
    string FirstName,
    string Surname,
    string AvatarId,
    DateTime CreatedAt,
    List<ColorDto> ColorRankings,
    string? TopColor
    );