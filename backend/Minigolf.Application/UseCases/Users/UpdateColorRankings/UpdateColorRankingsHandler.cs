using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Users.UpdateColorRankings;

public sealed class UpdateColorRankingsHandler(IUserRepository userRepository, IColorRepository colorRepository)
{
    public async Task<UpdateColorRankingsResult> HandleAsync(UpdateColorRankingsCommand cmd)
    {
        var allColors = await colorRepository.GetAllAsync();
        var validColorIds = allColors.Select(c => c.Id).ToHashSet();

        if (cmd.ColorIds.Count != 6 || cmd.ColorIds.Distinct().Count() != 6 || cmd.ColorIds.Any(id => !validColorIds.Contains(id)))
            return UpdateColorRankingsResult.Fail("Invalid color rankings — must include exactly 6 distinct valid colors");

        await userRepository.SaveColorRankingsAsync(cmd.UserId, cmd.ColorIds);
        return UpdateColorRankingsResult.Ok();
    }
}