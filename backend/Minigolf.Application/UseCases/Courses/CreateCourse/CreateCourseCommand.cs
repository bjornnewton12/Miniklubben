namespace Minigolf.Application.UseCases.Courses.CreateCourse;

public sealed record CreateCourseCommand(
    string Name,
    string Location,
    int NumberOfHoles
    );