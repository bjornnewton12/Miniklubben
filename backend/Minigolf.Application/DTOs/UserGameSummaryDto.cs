namespace Minigolf.Application.DTOs;

public sealed record UserGameSummaryDto(
    Guid Id,
    string CourseName,
    string CourseLocation,
    string? CourseImageUrl,
    DateTime? CompletedAt,
    List<UserGamePlayerDto> Players
);