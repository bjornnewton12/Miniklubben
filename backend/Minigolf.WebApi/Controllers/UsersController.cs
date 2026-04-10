using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Users.GetCurrentUser;
using Minigolf.Application.UseCases.Users.GetUserByUsername;
using Minigolf.Application.UseCases.Users.UpdateColorRankings;
using Minigolf.Application.UseCases.Users.UpdateUserProfile;
using Minigolf.WebApi.Contracts.Users;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]

public sealed class UsersController : ControllerBase
{
    private readonly GetCurrentUserHandler _getCurrentHandler;
    private readonly GetUserByUsernameHandler _getUsernameHandler;
    private readonly UpdateColorRankingsHandler _updateColorRankingsHandler;
    private readonly UpdateUserProfileHandler _updateUserProfileHandler;

    public UsersController(GetCurrentUserHandler getCurrentUserHandler, GetUserByUsernameHandler getUserByUsernameHandler, UpdateColorRankingsHandler updateColorRankingsHandler, UpdateUserProfileHandler updateUserProfileHandler)
    {
        _getCurrentHandler = getCurrentUserHandler;
        _getUsernameHandler = getUserByUsernameHandler;
        _updateColorRankingsHandler = updateColorRankingsHandler;
        _updateUserProfileHandler = updateUserProfileHandler;
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

    [HttpPut("me/color-rankings")]
    public async Task<IActionResult> UpdateColorRankings(UpdateColorRankingsRequest request)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var command = new UpdateColorRankingsCommand(userId, request.ColorIds);
        var result = await _updateColorRankingsHandler.HandleAsync(command);

        if (result.Success)
            return Ok();

        return BadRequest(result.Error);
    }

    [HttpPut("me/profile")]
    public async Task<IActionResult> UpdateProfile(UpdateUserProfileRequest request)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var command = new UpdateUserProfileCommand(userId, request.FirstName, request.Surname, request.AvatarId);
        var result = await _updateUserProfileHandler.HandleAsync(command);

        if (result.Success)
            return Ok();

        return BadRequest(result.Error);
    }
}