using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Users.GetCurrentUser;
using Minigolf.Application.UseCases.Users.GetUserByUsername;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]

public sealed class UsersController : ControllerBase
{
    private readonly GetCurrentUserHandler _getCurrentHandler;
    private readonly GetUserByUsernameHandler _getUsernameHandler;

    public UsersController(GetCurrentUserHandler getCurrentUserHandler, GetUserByUsernameHandler getUserByUsernameHandler)
    {
        _getCurrentHandler = getCurrentUserHandler;
        _getUsernameHandler = getUserByUsernameHandler;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var result = await _getCurrentHandler.HandleAsync(new GetCurrentUserQuery(userId));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var result = await _getUsernameHandler.HandleAsync(new GetUserByUsernameQuery(username));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }
}