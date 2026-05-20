using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.GetAllUsers;

public sealed class GetAllUsersHandler(IUserRepository userRepository)
{
    public async Task<GetAllUsersResult> HandleAsync(GetAllUsersQuery query)
    {
        var users = await userRepository.GetAllAsync();
        var dtos = users
            .Where(u => u.Role != "admin")
            .Select(u => new AdminUserDto(u.Id, u.Username, u.FirstName, u.Surname, u.AvatarId, u.Role))
            .ToList();
        return GetAllUsersResult.Ok(dtos);
    }
}
