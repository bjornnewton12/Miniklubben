using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Auth.LoginUser;
using Minigolf.Application.UseCases.Auth.RegisterUser;
using Minigolf.Application.UseCases.Auth.CheckUsername;
using RegisterRequest = Minigolf.WebApi.Contracts.Authorization.RegisterRequest;
using LoginRequest = Minigolf.WebApi.Contracts.Authorization.LoginRequest;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly RegisterUserHandler _registerHandler;
    private readonly LoginUserHandler _loginHandler;
    private readonly CheckUsernameHandler _checkUsernameHandler;

    public AuthController(RegisterUserHandler registerHandler, LoginUserHandler loginHandler, CheckUsernameHandler checkUsernameHandler)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
        _checkUsernameHandler = checkUsernameHandler;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var command = new RegisterUserCommand(request.Username, request.FirstName, request.Surname, request.Password, request.AvatarId, request.ColorRankingIds);
        var result = await _registerHandler.HandleAsync(command);

        if (result.Success)
            return Ok(result);

        return Conflict(result.Error);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var command = new LoginUserCommand(request.Username, request.Password);
        var result = await _loginHandler.HandleAsync(command);

        if (result.Success)
            return Ok(result);

        return Unauthorized(result.Error);
    }

    [HttpGet("check-username/{username}")]
    public async Task<IActionResult> CheckUsername(string username)
    {
        var exists = await _checkUsernameHandler.HandleAsync(username);
        return Ok(new { exists });
    }
}


