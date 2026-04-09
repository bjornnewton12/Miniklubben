namespace Minigolf.Domain.Models;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string AvatarId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = "user";

    public ICollection<Friendship> SentFriendRequests { get; set; } = [];
    public ICollection<Friendship> ReceivedFriendRequests { get; set; } = [];
    public ICollection<Game> CreatedGames { get; set; } = [];
    public ICollection<GamePlayer> GamePlayers { get; set; } = [];
    public ICollection<UserColorRanking> ColorRankings { get; set; } = [];
}
