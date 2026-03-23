namespace Minigolf.Application.DTOs;

public sealed record CourseDto(
    Guid Id,
    string Name,
    string? Description,
    string? ImageUrl,
    int MinHoles,
    int MaxHoles,
    List<CourseHoleDto> Holes
    );