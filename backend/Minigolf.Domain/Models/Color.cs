namespace Minigolf.Domain.Models;

public class Color
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string HexValue { get; set; } = string.Empty;

    public ICollection<UserColorRanking> UserColorRankings { get; set; } = [];
}
