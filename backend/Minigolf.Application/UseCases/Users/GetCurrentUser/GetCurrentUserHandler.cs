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

        var rankingDtos = user.ColorRankings
            .OrderBy(r => r.Rank)
            .Select(r => new ColorDto(r.Color.Id, r.Color.Name, r.Color.HexValue))
            .ToList();

        var topColor = rankingDtos.FirstOrDefault()?.HexValue;

        var userDto = new UserDto(user.Id, user.Username, user.FirstName, user.Surname, user.AvatarId, user.CreatedAt, rankingDtos, topColor);

        return GetCurrentUserResult.Ok(userDto);
    }
}