using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Games.CreateGame;

public sealed class CreateGameHandler(
    IGameRepository gameRepository, ICourseRepository courseRepository, 
    IUserRepository userRepository, IColorRepository colorRepository)
{
    public async Task<CreateGameResult> HandleAsync(CreateGameCommand cmd)
    {
        if (cmd.Players.Count < 1 || cmd.Players.Count > 6)
            return CreateGameResult.Fail("There has to between 1 - 6 players");

        Course course;

        if (cmd.CourseId.HasValue)
        {
            var existing = await courseRepository.GetByIdAsync(cmd.CourseId.Value);
            if (existing == null)
                return CreateGameResult.Fail("Course not found");
            course = existing;
        }
        else if (cmd.NewCourseName != null)
        {
            var newCourse = new Course
            {
                Name = cmd.NewCourseName,
                MinHoles = cmd.NumberOfHoles,
                MaxHoles = cmd.NumberOfHoles
            };
            course = await courseRepository.CreateAsync(newCourse);
        }
        else
        {
            return CreateGameResult.Fail("Course must be provided");
        }

        var game = new Game
        {
            CourseId = course.Id,
            HolesPlayed = cmd.NumberOfHoles,
            CreatedBy = cmd.CreatedBy,
            Status = "in_progress",
            CreatedAt = DateTime.UtcNow
        };

        var registeredUserIds = cmd.Players
      .Where(p => p.UserId.HasValue)
      .Select(p => p.UserId!.Value)
      .ToList();

        var allColors = await colorRepository.GetAllAsync();
        var rankings = await userRepository.GetColorRankingsByUserIdsAsync(registeredUserIds);

        var rankingsMap = rankings
            .GroupBy(r => r.UserId)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(r => r.Rank).Select(r => r.ColorId).ToList()
            );

        var takenColors = new HashSet<Guid>();
        var playerColorMap = new Dictionary<Guid, Guid>(); // userId -> colorId

        var unassigned = registeredUserIds.ToList();
        var currentRankIndex = unassigned.ToDictionary(id => id, _ => 0);
        var rng = new Random();

        while (unassigned.Count > 0)
        {
            var preferences = new Dictionary<Guid, Guid>();
            foreach (var playerId in unassigned)
            {
                var playerRankings = rankingsMap.GetValueOrDefault(playerId, []);
                while (currentRankIndex[playerId] < playerRankings.Count && takenColors.Contains(playerRankings[currentRankIndex[playerId]]))
                    currentRankIndex[playerId]++;

                if (currentRankIndex[playerId] < playerRankings.Count)
                    preferences[playerId] = playerRankings[currentRankIndex[playerId]];
                else
                {
                    var fallback = allColors.First(c => !takenColors.Contains(c.Id)).Id;
                    preferences[playerId] = fallback;
                }
            }

            foreach (var group in preferences.GroupBy(p => p.Value))
            {
                var color = group.Key;
                var playerIds = group.Select(p => p.Key).ToList();
                var winner = playerIds[rng.Next(playerIds.Count)];
                playerColorMap[winner] = color;
                takenColors.Add(color);
                foreach (var loser in playerIds.Where(id => id != winner))
                    currentRankIndex[loser]++;
                unassigned.RemoveAll(id => id == winner);
            }
        }

        var remainingColors = allColors.Where(c => !takenColors.Contains(c.Id)).ToList();
        var shuffled = remainingColors.OrderBy(_ => rng.Next()).ToList();
        var guestColorQueue = new Queue<Guid>(shuffled.Select(c => c.Id));

        game.Players = cmd.Players.Select(p => new GamePlayer
        {
            GameId = game.Id,
            UserId = p.UserId,
            GuestName = p.GuestName,
            AssignedColorId = p.UserId.HasValue
                ? playerColorMap.GetValueOrDefault(p.UserId.Value)
                : guestColorQueue.TryDequeue(out var guestColor) ? guestColor : null
        }).ToList();

        var created = await gameRepository.CreateAsync(game);

        var dto = new GameDto(
            created.Id,
            created.CourseId,
            created.HolesPlayed,
            created.CreatedBy,
            created.Status,
            created.CreatedAt,
            created.CompletedAt,
            created.Players
                .Select(p => new GamePlayerDto(
                    p.Id, 
                    p.GameId, 
                    p.UserId, 
                    p.GuestName, 
                    p.AssignedColorId, 
                    p.FinalScore, 
                    p.Rank))
                .ToList()
        );

        return CreateGameResult.Ok(dto);


    }
}
