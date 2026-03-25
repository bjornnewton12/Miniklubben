using Minigolf.Domain.Models;

namespace Minigolf.Domain.Models;

public class GamePlayer
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid? UserId { get; set; }       // null if guest
    public string? GuestName { get; set; }  // null if registered user
    public Guid? AssignedColorId { get; set; }
    public int? FinalScore { get; set; }
    public int? Rank { get; set; }

    public Game Game { get; set; } = null!;
    public User? User { get; set; }
    public Color? AssignedColor { get; set; }
    public ICollection<Score> Scores { get; set; } = [];
}
