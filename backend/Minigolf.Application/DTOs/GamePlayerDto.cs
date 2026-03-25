namespace Minigolf.Application.DTOs;

public sealed record GamePlayerDto(
    Guid Id,
    Guid GameId,
    Guid? UserId,
    string? GuestName,
    Guid? AssignedColorId,
    int? FinalScore,
    int? Rank
    );