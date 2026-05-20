namespace Minigolf.Application.UseCases.Admin.RenameCourse;

public sealed record RenameCourseResult(bool Success, string? Error)
{
    public static RenameCourseResult Ok() => new(true, null);
    public static RenameCourseResult Fail(string error) => new(false, error);
}
