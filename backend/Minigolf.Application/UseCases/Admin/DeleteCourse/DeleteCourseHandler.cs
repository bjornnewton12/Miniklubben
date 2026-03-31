using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.DeleteCourse;

public sealed class DeleteCourseHandler(ICourseRepository courseRepository)
{
    public async Task<DeleteCourseResult> HandleAsync(DeleteCourseCommand cmd)
    {
        var deleted = await courseRepository.DeleteAsync(cmd.CourseId);
        if (!deleted)
            return DeleteCourseResult.Fail("Course not found");

        return DeleteCourseResult.Ok();
    }
}
