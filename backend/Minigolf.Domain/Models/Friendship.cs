namespace MinigolfApi.Models;

public class Friendship
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }
    public Guid AddresseeId { get; set; }
    public string Status { get; set; } = "pending"; // "pending" or "accepted"
    public DateTime CreatedAt { get; set; }

    public User Requester { get; set; } = null!;
    public User Addressee { get; set; } = null!;
}
