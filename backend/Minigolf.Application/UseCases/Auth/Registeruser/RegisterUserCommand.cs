namespace Minigolf.Application.UseCases.Auth.RegisterUser;

public sealed record RegisterUserCommand(
    string Username,
    string Password,
    string AvatarId,
    List<Guid> ColorRankingIds
    );
