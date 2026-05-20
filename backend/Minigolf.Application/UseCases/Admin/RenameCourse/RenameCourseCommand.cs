namespace Minigolf.Application.UseCases.Admin.RenameCourse;

public sealed record RenameCourseCommand(Guid CourseId, string NewName);
