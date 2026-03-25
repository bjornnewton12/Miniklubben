using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;

namespace Minigolf.Infrastructure.Persistance.Repositories;

public sealed class ColorRepository(AppDbContext db) : IColorRepository
{
    public async Task<List<Color>> GetAllAsync()
    {
        return await db.Colors.ToListAsync();
    }
}