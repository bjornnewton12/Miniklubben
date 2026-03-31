using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.DeleteUser;

public sealed class DeleteUserHandler(IUserRepository userRepository)
{
    public async Task<DeleteUserResult> HandleAsync(DeleteUserCommand cmd)
    {
        var deleted = await userRepository.DeleteAsync(cmd.UserId);
        if (!deleted)
            return DeleteUserResult.Fail("User not found");

        return DeleteUserResult.Ok();
    }
}
