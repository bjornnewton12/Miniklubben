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
        return await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task <User> CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }
}
