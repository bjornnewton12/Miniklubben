using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Courses.GetCourses;

public sealed record GetCoursesResult(bool Success, List<CourseDto>? Courses, string? Error)
{
    public static GetCoursesResult Ok(List<CourseDto> courses) =>
        new GetCoursesResult(true, courses, null);

    public static GetCoursesResult Fail(string error) =>
        new(false, null, error);

}