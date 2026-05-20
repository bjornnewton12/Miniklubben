using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IGameRepository
{
    Task<List<Game>> GetAllAsync();
    Task<Game?> GetByIdAsync(Guid id);
    Task<Game> CreateAsync(Game game);
    Task<List<Game>> GetByUserIdAsync(Guid userId);
    Task UpdateAsync(Game game);
    Task<bool> DeleteAsync(Guid id);
}