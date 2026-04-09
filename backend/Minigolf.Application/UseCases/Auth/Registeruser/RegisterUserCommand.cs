namespace Minigolf.Application.UseCases.Auth.RegisterUser;

public sealed record RegisterUserCommand(
    string Username,
    string FirstName,
    string Surname,
    string Password,
    string AvatarId,
    List<Guid> ColorRankingIds
    );
