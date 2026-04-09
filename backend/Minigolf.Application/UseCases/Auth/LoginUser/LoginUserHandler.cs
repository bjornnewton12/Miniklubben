using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Auth.LoginUser;

public sealed class LoginUserHandler(IUserRepository userRepository, IJwtService jwtService)
{
    public async Task<LoginUserResult> HandleAsync(LoginUserCommand cmd, CancellationToken ct = default)
    {
        // Find user by username → Fail("Invalid credentials") if not found
        var user = await userRepository.GetByUsernameAsync(cmd.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(cmd.Password, user.PasswordHash))
        {
            return LoginUserResult.Fail("Invalid credentials");
        }

        // Generate token
        var token = jwtService.GenerateToken(user);

        var rankingDtos = user.ColorRankings
            .OrderBy(r => r.Rank)
            .Select(r => new ColorDto(r.Color.Id, r.Color.Name, r.Color.HexValue))
            .ToList();

        var topColor = rankingDtos.FirstOrDefault()?.HexValue;

        // Map to UserDto
        var userDto = new UserDto(user.Id, user.Username, user.FirstName, user.Surname, user.AvatarId, user.CreatedAt, rankingDtos, topColor);

        // Return Ok
        return LoginUserResult.Ok(userDto, token);
    }
}
