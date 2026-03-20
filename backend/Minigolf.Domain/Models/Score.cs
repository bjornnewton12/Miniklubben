namespace Minigolf.Domain.Models;

public class Score
{
    public Guid Id { get; set; }
    public Guid GamePlayerId { get; set; }
    public int HoleNumber { get; set; }
    public int Strokes { get; set; }

    public GamePlayer GamePlayer { get; set; } = null!;
}
