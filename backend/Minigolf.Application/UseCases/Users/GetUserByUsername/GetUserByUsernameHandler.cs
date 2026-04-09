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

        var topColor = user.ColorRankings
            .OrderBy(r => r.Rank)
            .FirstOrDefault()?.Color.HexValue;

        var userDto = new UserDto(user.Id, user.Username, user.FirstName, user.Surname, user.AvatarId, user.CreatedAt, [], topColor);

        return GetUserByUsernameResult.Ok(userDto);
    }
}