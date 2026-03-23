using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Users.GetUserByUsername
{
    public sealed record GetUserByUsernameResult(bool Success, UserDto? User, string? Error)
    {
        public static GetUserByUsernameResult Ok(UserDto user) =>
            new(true, user, null);

        public static GetUserByUsernameResult Fail(string error) =>
            new(false, null, error);
    }
}