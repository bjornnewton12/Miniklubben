namespace Minigolf.Application.UseCases.Users.UpdateUserProfile;

public sealed record UpdateUserProfileCommand(
    Guid UserId,
    string FirstName,
    string Surname,
    string AvatarId
);
