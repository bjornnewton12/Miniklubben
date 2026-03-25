namespace Minigolf.WebApi.Contracts.Authorization;

public sealed record RegisterRequest(
    string Username,
    string Password,
    string AvatarId,
    List<Guid> ColorRankingIds
    );
