using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Auth.LoginUser;

public sealed class LoginUserHandler(IUserRepository userRepository, IJwtService jwtService)
{
    public async Task<LoginUserResult> HandleAsync(LoginUserCommand cmd, CancellationToken ct = default)
    {
        // 1. Find user by username → Fail("Invalid credentials") if not found
        var user = await userRepository.GetByUsernameAsync(cmd.Username);

        // 2.Verify password → Fail("Invalid credentials") if wrong
        // TODO verify password hash
        if (user == null)
        {
            return LoginUserResult.Fail("Invalid credentials");
        }

        // 3.Generate token
        var token = jwtService.GenerateToken(user);

        // 4.Map to UserDto
        var userDto = new UserDto(user.Id, user.Username, user.AvatarId, user.CreatedAt, []);

        // 5.Return Ok
        return LoginUserResult.Ok(userDto, token);
    }
}
