using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Auth.CheckUsername;

public sealed class CheckUsernameHandler(IUserRepository userRepository)
{
    public async Task<bool> HandleAsync(string username)
    {
        return await userRepository.UsernameExistsAsync(username);
    }
}
