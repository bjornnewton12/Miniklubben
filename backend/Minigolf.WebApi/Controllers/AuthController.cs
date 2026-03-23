using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Auth.LoginUser;
using Minigolf.Application.UseCases.Auth.RegisterUser;
using RegisterRequest = Minigolf.WebApi.Contracts.Authorization.RegisterRequest;
using LoginRequest = Minigolf.WebApi.Contracts.Authorization.LoginRequest;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly RegisterUserHandler _registerHandler;
    private readonly LoginUserHandler _loginHandler;

    public AuthController(RegisterUserHandler registerHandler, LoginUserHandler loginHandler)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var command = new RegisterUserCommand(request.Username, request.Password);
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
}


