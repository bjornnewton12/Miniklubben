using Minigolf.Application.DTOs;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;

namespace Minigolf.Application.UseCases.Courses.CreateCourse;

public sealed class CreateCourseHandler(ICourseRepository courseRepository)
{
    private static readonly HashSet<string> ValidLocations = new()
      {
          "Blekinge", "Bohuslän", "Dalarna", "Dalsland", "Gotland",
          "Gästrikland", "Halland", "Hälsingland", "Härjedalen", "Jämtland",
          "Lappland", "Medelpad", "Norrbotten", "Närke", "Skåne", "Småland",
          "Södermanland", "Uppland", "Värmland", "Västerbotten", "Västergötland",
          "Västmanland", "Ångermanland", "Öland", "Östergötland"
      };

    public async Task<CreateCourseResult> HandleAsync(CreateCourseCommand cmd)
    {
        if (string.IsNullOrWhiteSpace(cmd.Name))
            return CreateCourseResult.Fail("Name is required");

        if (!ValidLocations.Contains(cmd.Location))
            return CreateCourseResult.Fail("Invalid location");

        var course = new Course
        {
            Name = cmd.Name.Trim(),
            Location = cmd.Location
        };

        var saved = await courseRepository.CreateAsync(course);

        var dto = new CourseDto(saved.Id, saved.Name, saved.Description, saved.Location, saved.ImageUrl, saved.MinHoles, saved.MaxHoles, []);

        return CreateCourseResult.Ok(dto);
    }
}