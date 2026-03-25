namespace Minigolf.WebApi.Contracts.Games;

public sealed record SubmitScoresRequest(
    List<SubmitScoreItemRequest> Scores
    );

public sealed record SubmitScoreItemRequest(
    Guid GamePlayerId,
    int HoleNumber,
    int Strokes
    );