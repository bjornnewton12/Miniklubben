namespace Minigolf.WebApi.Contracts.Authorization;

public sealed record RegisterRequest(
    string Username,
    string FirstName,
    string Surname,
    string Password,
    string AvatarId,
    List<Guid> ColorRankingIds
    );
