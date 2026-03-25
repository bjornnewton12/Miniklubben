using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IColorRepository
{
    Task<List<Color>> GetAllAsync();
}
