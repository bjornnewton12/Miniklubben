using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;

namespace Minigolf.Infrastructure.Persistance.Repositories;
public sealed class GameRepository(AppDbContext db) : IGameRepository
{
    public async Task<List<Game>> GetAllAsync()
    {
        return await db.Games
            .Include(g => g.Course)
            .Include(g => g.Players)
                .ThenInclude(p => p.User)
            .Where(g => g.Status == "completed")
            .OrderByDescending(g => g.CompletedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var game = await db.Games.FindAsync(id);
        if (game == null) return false;
        db.Games.Remove(game);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<Game?> GetByIdAsync(Guid id)
    {
        return await db.Games
            .Include(g => g.Players)
            .ThenInclude(g => g.Scores)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<Game> CreateAsync(Game game)
    {
        db.Games.Add(game);
        await db.SaveChangesAsync();
        return game;
    }

    public async Task UpdateAsync(Game game)
    { 
        await db.SaveChangesAsync();
    }

    public async Task<List<Game>> GetByUserIdAsync(Guid userId)
    {
        return await db.Games
            .Include(g => g.Course)
            .Include(g => g.Players)
                .ThenInclude(p => p.AssignedColor)
            .Include(g => g.Players)
                .ThenInclude(p => p.User)
            .Where(g => g.Status == "completed" && g.Players.Any(p => p.UserId == userId))
            .OrderByDescending(g => g.CompletedAt)
            .ToListAsync();
    }
}