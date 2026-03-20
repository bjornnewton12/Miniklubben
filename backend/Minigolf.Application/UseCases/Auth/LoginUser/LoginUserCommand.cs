namespace Minigolf.Application.UseCases.Auth.LoginUser;

public sealed record LoginUserCommand(
    string Username,
    string Password
    );