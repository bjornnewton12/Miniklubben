using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Courses.GetCourses;

public sealed class GetCoursesHandler(ICourseRepository courseRepository)
{
    public async Task<GetCoursesResult> HandleAsync(GetCoursesQuery query)
    {
        var courses = await courseRepository.GetAllAsync();

        var dtos = courses.Select(c => new CourseDto(
            c.Id,
            c.Name,
            c.Description,
            c.Location,
            c.ImageUrl,
            c.MinHoles,
            c.MaxHoles,
            c.Holes.Select(h => new CourseHoleDto(h.Id, h.HoleNumber)).ToList()
            )).ToList();

        return GetCoursesResult.Ok(dtos);
    }
}