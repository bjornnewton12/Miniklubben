namespace Minigolf.WebApi.Contracts.Users;

public sealed record UpdateUserProfileRequest(string FirstName, string Surname, string AvatarId);
