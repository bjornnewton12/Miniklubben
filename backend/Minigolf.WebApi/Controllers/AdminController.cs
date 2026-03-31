using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Admin.DeleteCourse;
using Minigolf.Application.UseCases.Admin.DeleteUser;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "Admin")]
public sealed class AdminController(DeleteUserHandler deleteUserHandler, DeleteCourseHandler deleteCourseHandler) : ControllerBase
{
    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await deleteUserHandler.HandleAsync(new DeleteUserCommand(id));

        if (result.Success)
            return NoContent();

        return NotFound(result.Error);
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var result = await deleteCourseHandler.HandleAsync(new DeleteCourseCommand(id));

        if (result.Success)
            return NoContent();

        return NotFound(result.Error);
    }
}
