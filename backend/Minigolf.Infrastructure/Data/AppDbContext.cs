using Microsoft.EntityFrameworkCore;
using MinigolfApi.Models;

namespace MinigolfApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Friendship> Friendships => Set<Friendship>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseHole> CourseHoles => Set<CourseHole>();
    public DbSet<Game> Games => Set<Game>();
    public DbSet<GamePlayer> GamePlayers => Set<GamePlayer>();
    public DbSet<Score> Scores => Set<Score>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
        });

        // Friendship
        modelBuilder.Entity<Friendship>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(f => f.CreatedAt).HasDefaultValueSql("NOW()");
            e.HasIndex(f => new { f.RequesterId, f.AddresseeId }).IsUnique();

            e.HasOne(f => f.Requester)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(f => f.Addressee)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(f => f.AddresseeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Course
        modelBuilder.Entity<Course>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        // CourseHole
        modelBuilder.Entity<CourseHole>(e =>
        {
            e.HasKey(h => h.Id);
            e.Property(h => h.Id).HasDefaultValueSql("gen_random_uuid()");
            e.HasIndex(h => new { h.CourseId, h.HoleNumber }).IsUnique();

            e.HasOne(h => h.Course)
                .WithMany(c => c.Holes)
                .HasForeignKey(h => h.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Game
        modelBuilder.Entity<Game>(e =>
        {
            e.HasKey(g => g.Id);
            e.Property(g => g.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(g => g.CreatedAt).HasDefaultValueSql("NOW()");

            e.HasOne(g => g.Course)
                .WithMany(c => c.Games)
                .HasForeignKey(g => g.CourseId);

            e.HasOne(g => g.Creator)
                .WithMany(u => u.CreatedGames)
                .HasForeignKey(g => g.CreatedBy);
        });

        // GamePlayer
        modelBuilder.Entity<GamePlayer>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");

            e.HasOne(p => p.Game)
                .WithMany(g => g.Players)
                .HasForeignKey(p => p.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(p => p.User)
                .WithMany(u => u.GamePlayers)
                .HasForeignKey(p => p.UserId)
                .IsRequired(false);
        });

        // Score
        modelBuilder.Entity<Score>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");
            e.HasIndex(s => new { s.GamePlayerId, s.HoleNumber }).IsUnique();

            e.HasOne(s => s.GamePlayer)
                .WithMany(p => p.Scores)
                .HasForeignKey(s => s.GamePlayerId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
