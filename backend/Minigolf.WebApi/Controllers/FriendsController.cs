using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Friends.AcceptFriendRequest;
using Minigolf.Application.UseCases.Friends.GetFriends;
using Minigolf.Application.UseCases.Friends.RemoveFriend;
using Minigolf.Application.UseCases.Friends.SendFriendRequest;
using SendFriendRequestRequest = Minigolf.WebApi.Contracts.Friends.SendFriendRequestRequest;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/friends")]
[Authorize]

public sealed class FriendsController : ControllerBase
{
    private readonly AcceptFriendRequestHandler _acceptFriendRequestHandler;
    private readonly GetFriendsHandler _getFriendsHandler;
    private readonly RemoveFriendHandler _removeFriendHandler;
    private readonly SendFriendRequestHandler _sendFriendRequestHandler;

    public FriendsController(AcceptFriendRequestHandler acceptFriendRequestHandler, GetFriendsHandler getFriendsHandler, RemoveFriendHandler removeFriendHandler, SendFriendRequestHandler sendFriendRequestHandler)
    {
        _acceptFriendRequestHandler = acceptFriendRequestHandler;
        _getFriendsHandler = getFriendsHandler;
        _removeFriendHandler = removeFriendHandler;
        _sendFriendRequestHandler = sendFriendRequestHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        var friendIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (friendIdString == null || !Guid.TryParse(friendIdString, out var userId))
            return Unauthorized();

        var result = await _getFriendsHandler.HandleAsync(new GetFriendsQuery(userId));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }

    [HttpPost("request")]
    public async Task<IActionResult> SendRequest(SendFriendRequestRequest request)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var result = await _sendFriendRequestHandler.HandleAsync(new SendFriendRequestCommand(userId, request.AddresseeId));

        if (result.Success)
            return Ok(result);

        return BadRequest(result.Error);
    }

    [HttpPut("{id}/accept")]
    public async Task<IActionResult> AcceptRequest(Guid id)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var result = await _acceptFriendRequestHandler.HandleAsync(new AcceptFriendRequestCommand(id, userId));

        if (result.Success)
            return Ok(result);

        if (result.Error == "Unauthorized")
            return Forbid();

        return NotFound(result.Error);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFriend(Guid id)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var result = await _removeFriendHandler.HandleAsync(new RemoveFriendCommand(id, userId));

        if (result.Success)
            return Ok(result);

        if (result.Error == "Unauthorized")
            return Forbid();

        return NotFound(result.Error);
    }
}