using Minigolf.Application.DTOs;

namespace Minigolf.Application.UseCases.Users.GetColors;

public sealed record GetColorsResult(bool Success, List<ColorDto>? Colors, string? Error)
{
    public static GetColorsResult Ok(List<ColorDto> colors) => 
        new(true, colors, null);
    public static GetColorsResult Fail(string error) => 
        new(false, null, error);
}
