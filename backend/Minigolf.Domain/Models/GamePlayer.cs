namespace MinigolfApi.Models;

public class GamePlayer
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid? UserId { get; set; }       // null if guest
    public string? GuestName { get; set; }  // null if registered user
    public int? FinalScore { get; set; }
    public int? Rank { get; set; }

    public Game Game { get; set; } = null!;
    public User? User { get; set; }
    public ICollection<Score> Scores { get; set; } = [];
}
