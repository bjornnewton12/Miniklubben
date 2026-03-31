namespace Minigolf.Application.UseCases.Admin.DeleteCourse;

public sealed record DeleteCourseResult(bool Success, string? Error)
{
    public static DeleteCourseResult Ok() => new(true, null);
    public static DeleteCourseResult Fail(string error) => new(false, error);
}
