using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Users.GetUserByUsername;
public sealed class GetUserByUsernameHandler(IUserRepository userRepository)
{
    public async Task<GetUserByUsernameResult> HandleAsync(GetUserByUsernameQuery query)
    {
        var user = await userRepository.GetByUsernameAsync(query.Username);
        if (user == null)
            return GetUserByUsernameResult.Fail("User not found");

        var userDto = new UserDto(user.Id, user.Username, user.AvatarId, user.CreatedAt, []);

        return GetUserByUsernameResult.Ok(userDto);
    }
}