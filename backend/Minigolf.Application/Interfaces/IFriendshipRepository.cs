using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IFriendshipRepository
{
    // Returns all accepted friends
    Task<List<Friendship>> GetAcceptedFriendsAsync(Guid userId);

    // Returns all pending friend requests received by the user
    Task<List<Friendship>> GetPendingRequestsAsync(Guid userId);

    // Returns friendship by Id, or null if not found
    Task<Friendship?> GetByIdAsync(Guid id);

    // Returns an existing friendship between two users regardless of direction, or null if none exists
    Task<Friendship?> GetExistingAsync(Guid requesterId, Guid addresseeId);

    // Saves a new friendship to the database and returns it
    Task<Friendship> CreateAsync(Friendship friendship);

    // Update friendship
    Task UpdateAsync(Friendship friendship);

    // Delete friendship
    Task DeleteAsync(Friendship friendship);
}
