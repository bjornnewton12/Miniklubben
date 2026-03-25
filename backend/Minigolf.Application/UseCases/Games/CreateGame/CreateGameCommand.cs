namespace Minigolf.Application.UseCases.Games.CreateGame;

public sealed record CreateGameCommand(
    Guid CreatedBy,
    Guid? CourseId,
    string? NewCourseName,
    int NumberOfHoles,
    List<CreateGamePlayerInput> Players
    );

public sealed record CreateGamePlayerInput(
    Guid? UserId,
    string? GuestName
    );