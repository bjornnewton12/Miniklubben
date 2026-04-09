namespace Minigolf.Application.DTOs;

public sealed record UserGamePlayerDto(
    string DisplayName,
    string? AvatarId,
    string? ColorHex,
    int? FinalScore,
    int? Rank
);