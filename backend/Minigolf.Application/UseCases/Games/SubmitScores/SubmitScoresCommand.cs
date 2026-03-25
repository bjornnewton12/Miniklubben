namespace Minigolf.Application.UseCases.Games.SubmitScores;

public sealed record SubmitScoresCommand(
    Guid GameId,
    Guid SubmittedBy,
    List<SubmitScoreInput> Scores
    );

public sealed record SubmitScoreInput(
    Guid GamePlayerId,
    int HoleNumber,
    int Strokes
    );