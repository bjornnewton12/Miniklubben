using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Courses.GetCourses;
using Minigolf.Application.UseCases.Courses.GetCoursesById;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/courses")]

public sealed class CoursesController : ControllerBase
{
    private readonly GetCoursesHandler _getCoursesHandler;
    private readonly GetCoursesByIdHandler _getCoursesByIdHandler;

    public CoursesController(GetCoursesHandler getCoursesHandler, GetCoursesByIdHandler getCoursesByIdHandler)
    {
        _getCoursesHandler = getCoursesHandler;
        _getCoursesByIdHandler = getCoursesByIdHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var result = await _getCoursesHandler.HandleAsync(new GetCoursesQuery());

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseById(Guid id)
    {
        var result = await _getCoursesByIdHandler.HandleAsync(new GetCoursesByIdQuery(id));

        if (result.Success)
            return Ok(result);

        return NotFound(result.Error);
    }
}
