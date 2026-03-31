using Microsoft.EntityFrameworkCore;
using Minigolf.Domain.Models;

namespace Minigolf.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Friendship> Friendships => Set<Friendship>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseHole> CourseHoles => Set<CourseHole>();
    public DbSet<Game> Games => Set<Game>();
    public DbSet<GamePlayer> GamePlayers => Set<GamePlayer>();
    public DbSet<Score> Scores => Set<Score>();
    public DbSet<Color> Colors => Set<Color>();
    public DbSet<UserColorRanking> UserColorRankings => Set<UserColorRanking>();

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

            e.HasOne(p => p.AssignedColor)
                  .WithMany()
                  .HasForeignKey(p => p.AssignedColorId)
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

        modelBuilder.Entity<Color>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<UserColorRanking>(e =>
        {
            e.HasKey(r => new { r.UserId, r.ColorId });

            e.HasOne(r => r.User)
                .WithMany(u => u.ColorRankings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(r => r.Color)
                .WithMany(c => c.UserColorRankings)
                .HasForeignKey(r => r.ColorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Color>().HasData(
              new Color { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Tomat", HexValue = "#F81803" },
              new Color { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Korall", HexValue = "#FE9377" },
              new Color { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Rosa", HexValue = "#F7A6AD" },
              new Color { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Gullris", HexValue = "#F6B859" },
              new Color { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Havsgr\u00f6n", HexValue = "#45AC7F" },
              new Color { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Kungsbl\u00e5", HexValue = "#4B69FE" }
  );
    }
}
