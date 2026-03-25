namespace Minigolf.Application.DTOs;

public sealed record GamePlayerDto(
    Guid Id,
    Guid GameId,
    Guid? UserId,
    string? GuestName,
    int? FinalScore,
    int? Rank
    );