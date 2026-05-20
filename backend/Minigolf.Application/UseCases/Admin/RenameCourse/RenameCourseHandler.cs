using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.RenameCourse;

public sealed class RenameCourseHandler(ICourseRepository courseRepository)
{
    public async Task<RenameCourseResult> HandleAsync(RenameCourseCommand cmd)
    {
        if (string.IsNullOrWhiteSpace(cmd.NewName))
            return RenameCourseResult.Fail("Name cannot be empty");
        var renamed = await courseRepository.RenameAsync(cmd.CourseId, cmd.NewName.Trim());
        if (!renamed)
            return RenameCourseResult.Fail("Course not found");
        return RenameCourseResult.Ok();
    }
}
