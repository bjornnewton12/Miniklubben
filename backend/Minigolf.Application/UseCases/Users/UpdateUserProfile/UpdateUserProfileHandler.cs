using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Users.UpdateUserProfile;

public sealed class UpdateUserProfileHandler(IUserRepository userRepository)
{
    public async Task<UpdateUserProfileResult> HandleAsync(UpdateUserProfileCommand cmd)
    {
        var user = await userRepository.GetByIdAsync(cmd.UserId);
        if (user == null)
            return UpdateUserProfileResult.Fail("User not found");

        user.FirstName = cmd.FirstName;
        user.Surname = cmd.Surname;
        user.AvatarId = cmd.AvatarId;

        await userRepository.UpdateAsync(user);
        return UpdateUserProfileResult.Ok();
    }
}
