namespace MinigolfApi.Models;

public class Game
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public int HolesPlayed { get; set; }
    public Guid CreatedBy { get; set; }
    public string Status { get; set; } = "in_progress"; // "in_progress" or "completed"
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Course Course { get; set; } = null!;
    public User Creator { get; set; } = null!;
    public ICollection<GamePlayer> Players { get; set; } = [];
}
