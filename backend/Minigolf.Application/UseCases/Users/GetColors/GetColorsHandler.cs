using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;

namespace Minigolf.Application.UseCases.Users.GetColors;

public sealed class GetColorsHandler(IColorRepository colorRepository)
{
    public async Task<GetColorsResult> HandleAsync()
    {
        var colors = await colorRepository.GetAllAsync();
        var dtos = colors.Select(c => new ColorDto(c.Id, c.Name, c.HexValue)).ToList();
        return GetColorsResult.Ok(dtos);
    }
}