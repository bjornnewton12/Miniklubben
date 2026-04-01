using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Courses.CreateCourse;

public sealed record CreateCourseResult(bool Success, CourseDto? Course, string? Error)
{
    public static CreateCourseResult Ok(CourseDto course) => new(true, course, null);
    public static CreateCourseResult Fail(string error) => new(false, null, error);
}