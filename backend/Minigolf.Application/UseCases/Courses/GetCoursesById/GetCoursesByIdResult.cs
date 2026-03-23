using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Courses.GetCoursesById;

public sealed record GetCoursesByIdResult(bool Success, CourseDto? Course, string? Error)
{
    public static GetCoursesByIdResult Ok(CourseDto course) =>
        new(true, course, null);

    public static GetCoursesByIdResult Fail(string error) =>
        new(false, null, error);
}