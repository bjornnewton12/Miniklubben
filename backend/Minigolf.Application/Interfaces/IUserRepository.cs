using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IUserRepository
{
    // Returns a user by username, or null if not found
    Task<User?> GetByUsernameAsync(string username);

    // Returns true/false: does the username already exist?
    Task<bool> UsernameExistsAsync(string username);

    // Saves new user to the database and returns the saved user.
    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(Guid id);
    Task SaveColorRankingsAsync(Guid userId, List<Guid> colorIds);
    Task<List<UserColorRanking>> GetColorRankingsByUserIdsAsync(IEnumerable<Guid> userIds);
    Task<bool> DeleteAsync(Guid id);
}