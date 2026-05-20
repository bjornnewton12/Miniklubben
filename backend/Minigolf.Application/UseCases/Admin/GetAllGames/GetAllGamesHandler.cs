using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.GetAllGames;

public sealed class GetAllGamesHandler(IGameRepository gameRepository)
{
    public async Task<GetAllGamesResult> HandleAsync(GetAllGamesQuery query)
    {
        var games = await gameRepository.GetAllAsync();
        var dtos = games.Select(g =>
        {
            var playerNames = g.Players
                .Select(p => p.User != null ? $"{p.User.FirstName} {p.User.Surname}".Trim() : p.GuestName ?? "Gäst")
                .ToList();
            return new AdminGameDto(g.Id, g.Course?.Name ?? "Okänd bana", g.CompletedAt, playerNames);
        }).ToList();
        return GetAllGamesResult.Ok(dtos);
    }
}
