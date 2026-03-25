namespace Minigolf.WebApi.Contracts.Games;

public sealed record CreateGameRequest(
    Guid? CourseId,
    string? NewCourseName,
    int NumberOfHoles,
    List<CreateGamePlayerRequest> Players
    );

public sealed record CreateGamePlayerRequest(
    Guid? UserId,
    string? GuestName
    );