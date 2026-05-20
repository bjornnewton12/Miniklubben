using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Admin.DeleteGame;

public sealed class DeleteGameHandler(IGameRepository gameRepository)
{
    public async Task<DeleteGameResult> HandleAsync(DeleteGameCommand cmd)
    {
        var deleted = await gameRepository.DeleteAsync(cmd.GameId);
        if (!deleted)
            return DeleteGameResult.Fail("Game not found");
        return DeleteGameResult.Ok();
    }
}
