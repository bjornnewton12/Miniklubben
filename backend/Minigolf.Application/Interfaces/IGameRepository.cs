using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IGameRepository
{
    Task<List<Game>> GetAllAsync();
    Task<Game?> GetByIdAsync(Guid id);
    Task<Game> CreateAsync(Game game);
    Task UpdateAsync(Game game);
}