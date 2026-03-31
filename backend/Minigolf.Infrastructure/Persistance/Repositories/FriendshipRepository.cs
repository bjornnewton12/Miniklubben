using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;

namespace Minigolf.Infrastructure.Persistance.Repositories;

public sealed class FriendshipRepository(AppDbContext db) : IFriendshipRepository
{
    //  - GetAcceptedFriendsAsync — query db.Friendships where Status
    //== "accepted" AND either RequesterId == userId OR AddresseeId == userId
    public async Task<List<Friendship>> GetAcceptedFriendsAsync(Guid userId)
    {
        return await db.Friendships
            .Include(f => f.Requester).ThenInclude(u => u.ColorRankings).ThenInclude(r => r.Color)
            .Include(f => f.Addressee).ThenInclude(u => u.ColorRankings).ThenInclude(r => r.Color)
            .Where(f => f.Status == "accepted" && (f.RequesterId == userId || f.AddresseeId == userId))
            .ToListAsync();
    }

    public async Task<List<Friendship>> GetPendingRequestsAsync(Guid userId)
    {
        return await db.Friendships
            .Include(f => f.Requester).ThenInclude(u => u.ColorRankings).ThenInclude(r => r.Color)
            .Where(f => f.Status == "pending" && f.AddresseeId == userId)
            .ToListAsync();
    }

    //- GetByIdAsync — FirstOrDefaultAsync by Id
    public async Task<Friendship?> GetByIdAsync(Guid id)
    {
        return await db.Friendships.FirstOrDefaultAsync(u => u.Id == id);
    }


    //- GetExistingAsync — find where (RequesterId == requesterId &&
    //AddresseeId == addresseeId) OR the reverse
    public async Task<Friendship?> GetExistingAsync(Guid requesterId, Guid addresseeId)
    {
        return await db.Friendships.FirstOrDefaultAsync(f =>
        (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
        (f.RequesterId == addresseeId && f.AddresseeId == requesterId));
    }


    //- CreateAsync — add and save, return the friendship
    public async Task<Friendship> CreateAsync(Friendship friendship)
    {
        db.Friendships.Add(friendship);
        await db.SaveChangesAsync();
        return friendship;
    }


    //- UpdateAsync — just SaveChangesAsync(EF Core tracks changes
    //automatically)
    public async Task UpdateAsync(Friendship friendship)
    {
        await db.SaveChangesAsync();
    }

    //- DeleteAsync — db.Friendships.Remove(friendship) then save
    public async Task DeleteAsync(Friendship friendship)
    {
        db.Friendships.Remove(friendship);
        await db.SaveChangesAsync();
    }
}