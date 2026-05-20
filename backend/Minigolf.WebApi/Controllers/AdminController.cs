using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Admin.DeleteCourse;
using Minigolf.Application.UseCases.Admin.DeleteGame;
using Minigolf.Application.UseCases.Admin.DeleteUser;
using Minigolf.Application.UseCases.Admin.GetAllGames;
using Minigolf.Application.UseCases.Admin.GetAllUsers;
using Minigolf.Application.UseCases.Admin.RenameCourse;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "Admin")]
public sealed class AdminController(
    DeleteUserHandler deleteUserHandler,
    DeleteCourseHandler deleteCourseHandler,
    DeleteGameHandler deleteGameHandler,
    GetAllUsersHandler getAllUsersHandler,
    GetAllGamesHandler getAllGamesHandler,
    RenameCourseHandler renameCourseHandler) : ControllerBase
{
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await getAllUsersHandler.HandleAsync(new GetAllUsersQuery());
        return Ok(result);
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await deleteUserHandler.HandleAsync(new DeleteUserCommand(id));
        if (result.Success) return NoContent();
        return NotFound(result.Error);
    }

    [HttpGet("games")]
    public async Task<IActionResult> GetAllGames()
    {
        var result = await getAllGamesHandler.HandleAsync(new GetAllGamesQuery());
        return Ok(result);
    }

    [HttpDelete("games/{id:guid}")]
    public async Task<IActionResult> DeleteGame(Guid id)
    {
        var result = await deleteGameHandler.HandleAsync(new DeleteGameCommand(id));
        if (result.Success) return NoContent();
        return NotFound(result.Error);
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var result = await deleteCourseHandler.HandleAsync(new DeleteCourseCommand(id));
        if (result.Success) return NoContent();
        return NotFound(result.Error);
    }

    [HttpPut("courses/{id:guid}/name")]
    public async Task<IActionResult> RenameCourse(Guid id, [FromBody] RenameCourseRequest request)
    {
        var result = await renameCourseHandler.HandleAsync(new RenameCourseCommand(id, request.NewName));
        if (result.Success) return NoContent();
        return BadRequest(result.Error);
    }
}

public sealed record RenameCourseRequest(string NewName);
