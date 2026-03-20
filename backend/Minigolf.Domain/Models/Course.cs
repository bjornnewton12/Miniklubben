namespace Minigolf.Domain.Models;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int MinHoles { get; set; }
    public int MaxHoles { get; set; }

    public ICollection<CourseHole> Holes { get; set; } = [];
    public ICollection<Game> Games { get; set; } = [];
}
