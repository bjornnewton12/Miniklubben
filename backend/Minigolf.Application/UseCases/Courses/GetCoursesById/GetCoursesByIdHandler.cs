using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Courses.GetCoursesById;

public sealed class GetCoursesByIdHandler(ICourseRepository courseRepository)
{
    public async Task<GetCoursesByIdResult> HandleAsync(GetCoursesByIdQuery query)
    {
        var course = await courseRepository.GetByIdAsync(query.Id);
        if (course == null)
            return GetCoursesByIdResult.Fail("Course not found");

        var courseDto = new CourseDto(
                        course.Id,
                        course.Name,
                        course.Description,
                        course.Location,
                        course.ImageUrl,
                        course.MinHoles,
                        course.MaxHoles,
                        course.Holes.Select(h => new CourseHoleDto(h.Id, h.HoleNumber)).ToList());

        return GetCoursesByIdResult.Ok(courseDto);
    }
}