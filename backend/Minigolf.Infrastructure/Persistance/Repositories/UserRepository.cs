using Minigolf.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Minigolf.Infrastructure.Data;
using Minigolf.Domain.Models;

namespace Minigolf.Infrastructure.Persistance.Repositories;

public sealed class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await db.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await db.Users
            .Include(u => u.ColorRankings)
                .ThenInclude(r => r.Color)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task <User> CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await db.Users
            .Include(u => u.ColorRankings)
                .ThenInclude(r => r.Color)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task SaveColorRankingsAsync(Guid userId, List<Guid> colorIds)
    {
        var existing = db.UserColorRankings.Where(r => r.UserId == userId);
        db.UserColorRankings.RemoveRange(existing);

        var rankings = colorIds.Select((colorId, index) => new UserColorRanking
        {
            UserId = userId,
            ColorId = colorId,
            Rank = index + 1
        });

        db.UserColorRankings.AddRange(rankings);
        await db.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return false;
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<List<UserColorRanking>> GetColorRankingsByUserIdsAsync(IEnumerable<Guid> userIds)
    {
        return await db.UserColorRankings
            .Where(r => userIds.Contains(r.UserId))
            .ToListAsync();
    }
}
