namespace Minigolf.Application.DTOs;

public sealed record GameDto(
    Guid Id,
    Guid CourseId,
    int HolesPlayed,
    Guid CreatedBy,
    string Status,
    DateTime CreatedAt,
    DateTime? CompletedAt,
    List<GamePlayerDto> Players
    );