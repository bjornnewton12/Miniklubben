using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;

namespace Minigolf.Infrastructure.Persistance.Repositories;
public sealed class GameRepository(AppDbContext db) : IGameRepository
{
    public async Task<List<Game>> GetAllAsync()
    {
        return await db.Games.ToListAsync();
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
}