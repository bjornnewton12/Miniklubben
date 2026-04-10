namespace Minigolf.Application.DTOs;

public sealed record UserGamePlayerDto(
    string DisplayName,
    string FirstName,
    string Surname,
    string? AvatarId,
    string? ColorHex,
    int? FinalScore,
    int? Rank
);