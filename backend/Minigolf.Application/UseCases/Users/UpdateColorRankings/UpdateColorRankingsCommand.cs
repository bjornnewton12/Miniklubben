namespace Minigolf.Application.UseCases.Users.UpdateColorRankings;

public sealed record UpdateColorRankingsCommand(
    Guid UserId,
    List<Guid> ColorIds
    );