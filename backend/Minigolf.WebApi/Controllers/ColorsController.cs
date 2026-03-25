using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Users.GetColors;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/colors")]
public sealed class ColorsController(GetColorsHandler handler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetColors()
    {
        var result = await handler.HandleAsync();
        return Ok(result);
    }
}