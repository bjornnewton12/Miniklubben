using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Users.GetCurrentUser;

public sealed class GetCurrentUserHandler(IUserRepository userRepository)
{
    public async Task<GetCurrentUserResult> HandleAsync(GetCurrentUserQuery query)
    {
        var user = await userRepository.GetByIdAsync(query.UserId);
        if (user == null)
            return GetCurrentUserResult.Fail("User not found");

        var topColor = user.ColorRankings
            .OrderBy(r => r.Rank)
            .FirstOrDefault()?.Color.HexValue;

        var userDto = new UserDto(user.Id, user.Username, user.AvatarId, user.CreatedAt, [], topColor);

        return GetCurrentUserResult.Ok(userDto);
    }
}