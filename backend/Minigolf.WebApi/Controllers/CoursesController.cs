using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minigolf.Application.UseCases.Courses.CreateCourse;
using Minigolf.Application.UseCases.Courses.GetCourses;
using Minigolf.Application.UseCases.Courses.GetCoursesById;

namespace Minigolf.WebApi.Controllers;

[ApiController]
[Route("api/courses")]

public sealed class CoursesController : ControllerBase
{
    private readonly GetCoursesHandler _getCoursesHandler;
    private readonly GetCoursesByIdHandler _getCoursesByIdHandler;
    private readonly CreateCourseHandler _createCourseHandler;

    public CoursesController(GetCoursesHandler getCoursesHandler, GetCoursesByIdHandler getCoursesByIdHandler, CreateCourseHandler createCourseHandler)
    {
        _getCoursesHandler = getCoursesHandler;
        _getCoursesByIdHandler = getCoursesByIdHandler;
        _createCourseHandler = createCourseHandler;
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

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseCommand cmd)
    {
        var result = await _createCourseHandler.HandleAsync(cmd);
        if (result.Success)
            return Ok(result);
        return BadRequest(result.Error);
    }

}
