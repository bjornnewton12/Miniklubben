using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Games.CreateGame;

public sealed class CreateGameHandler(IGameRepository gameRepository, ICourseRepository courseRepository)
{
    public async Task<CreateGameResult> HandleAsync(CreateGameCommand cmd)
    {
        if (cmd.Players.Count < 1 || cmd.Players.Count > 5)
            return CreateGameResult.Fail("There has to between 1 - 5 players");

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

        game.Players = cmd.Players.Select(p => new GamePlayer
        {
            GameId = game.Id,
            UserId = p.UserId,
            GuestName = p.GuestName
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
            created.Players.Select(p => new GamePlayerDto(p.Id, p.GameId,
        p.UserId, p.GuestName, p.FinalScore, p.Rank)).ToList()
        );

        return CreateGameResult.Ok(dto);


    }
}
