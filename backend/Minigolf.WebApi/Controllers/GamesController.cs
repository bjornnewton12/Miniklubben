using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Games.CreateGame;
using Minigolf.Application.UseCases.Games.GetGameById;
using Minigolf.Application.UseCases.Games.GetGameResults;
using Minigolf.Application.UseCases.Games.GetUserGames;
using Minigolf.Application.UseCases.Games.SubmitScores;
using Minigolf.WebApi.Contracts.Games;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/games")]
[Authorize]
public sealed class GamesController : ControllerBase
{
    private readonly CreateGameHandler _createGameHandler;
    private readonly GetGameByIdHandler _getGameByIdHandler;
    private readonly GetGameResultHandler _getGameResultHandler;
    private readonly SubmitScoresHandler _submitScoresHandler;
    private readonly GetUserGamesHandler _getUserGamesHandler;

    public GamesController(CreateGameHandler createGameHandler, GetGameByIdHandler getGameByIdHandler, GetGameResultHandler getGameResultHandler, SubmitScoresHandler submitScoresHandler, GetUserGamesHandler getUserGamesHandler)
    {
        _createGameHandler = createGameHandler;
        _getGameByIdHandler = getGameByIdHandler;
        _getGameResultHandler = getGameResultHandler;
        _submitScoresHandler = submitScoresHandler;
        _getUserGamesHandler = getUserGamesHandler;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGame(CreateGameRequest request)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var players = request.Players
            .Select(p => new CreateGamePlayerInput(p.UserId, p.GuestName))
            .ToList();

        var command = new CreateGameCommand(userId, request.CourseId, request.NewCourseName, request.NumberOfHoles, players);
        var result = await _createGameHandler.HandleAsync(command);

        if (result.Success)
            return Ok(result);

        return BadRequest(result.Error);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGameById(Guid id)
    {
        var result = await _getGameByIdHandler.HandleAsync(new GetGameByIdQuery(id));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }

    [HttpPost("{id}/scores")]
    public async Task<IActionResult> SubmitScores(SubmitScoresRequest request, Guid id)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var scores = request.Scores
            .Select(s => new SubmitScoreInput(s.GamePlayerId, s.HoleNumber, s.Strokes))
            .ToList();

        var command = new SubmitScoresCommand(id, userId, scores);
        var result = await _submitScoresHandler.HandleAsync(command);

        if (result.Success)
            return Ok(result);

        return BadRequest(result.Error);
    }

    [HttpGet("{id}/results")]
    public async Task<IActionResult> GetGameResult(Guid id)
    {
        var result = await _getGameResultHandler.HandleAsync(new GetGameResultQuery(id));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserGames()
    {
        var userIdString =
    User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var result = await _getUserGamesHandler.HandleAsync(new GetUserGamesQuery(userId));
        if (result.Success)
            return Ok(result);

        return BadRequest(result.Error);
    }
}