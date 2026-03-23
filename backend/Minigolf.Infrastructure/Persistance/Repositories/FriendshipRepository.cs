using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;
using System.Diagnostics;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Minigolf.Infrastructure.Persistance.Repositories;

public sealed class FriendshipRepository(AppDbContext db) : IFriendshipRepository
{
    //  - GetAcceptedFriendsAsync — query db.Friendships where Status
    //== "accepted" AND either RequesterId == userId OR AddresseeId == userId
    public async Task <>

    //- GetByIdAsync — FirstOrDefaultAsync by Id
    public async Task<Friendship?> GetByIdAsync(Guid id)
    {
        return await db.Friendships.FirstOrDefaultAsync(u => u.Id == id);
    }


    //- GetExistingAsync — find where (RequesterId == requesterId &&
    //AddresseeId == addresseeId) OR the reverse



    //- CreateAsync — add and save, return the friendship
    public async Task<Friendship> CreateAsync(Friendship friendship)
    {
        db.Friendships.Add(friendship);
        await db.SaveChangesAsync();
        return friendship;
    }


    //- UpdateAsync — just SaveChangesAsync(EF Core tracks changes
    //automatically)


    //- DeleteAsync — db.Friendships.Remove(friendship) then save
}




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

    public async Task<User> CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
}

