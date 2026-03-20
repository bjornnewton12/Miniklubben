using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Auth.RegisterUser;

public sealed class RegisterUserHandler (IUserRepository userRepository, IJwtService jwtService)
{
    public async Task<RegisterUserResult> HandleAsync(RegisterUserCommand cmd, CancellationToken ct = default)
    {
        // Check if user already exists
        if (await userRepository.UsernameExistsAsync(cmd.Username))
            return RegisterUserResult.Fail($"{cmd.Username} already exists");

        // Create new user
        var user = new User
        {
            Username = cmd.Username,
            PasswordHash = "to_be_hashed"
        };

        // Save the user
        var savedUser = await userRepository.CreateAsync(user);
        var token = jwtService.GenerateToken(savedUser);

        var userDto = new UserDto(savedUser.Id, savedUser.Username, savedUser.AvatarId, savedUser.CreatedAt);

        return RegisterUserResult.Ok(userDto, token);
    }
}
