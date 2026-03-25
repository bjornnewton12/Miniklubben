namespace Minigolf.Domain.Models;

public class UserColorRanking
{
    public Guid UserId { get; set; }
    public Guid ColorId { get; set; }
    public int Rank { get; set; }
    public User User { get; set; } = null!;
    public Color Color { get; set; } = null!;
}
