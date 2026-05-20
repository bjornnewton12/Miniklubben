namespace Minigolf.Application.UseCases.Admin.GetAllUsers;

public sealed record AdminUserDto(Guid Id, string Username, string FirstName, string Surname, string AvatarId, string Role);

public sealed record GetAllUsersResult(bool Success, List<AdminUserDto> Users, string? Error)
{
    public static GetAllUsersResult Ok(List<AdminUserDto> users) => new(true, users, null);
    public static GetAllUsersResult Fail(string error) => new(false, [], error);
}
