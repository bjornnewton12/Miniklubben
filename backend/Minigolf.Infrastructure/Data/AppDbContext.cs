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
              new Color { Id = Guid.Parse("aa000000-0000-0000-0000-000000000000"), Name = "Jordgubbs\u00f6d", HexValue = "#E71B00" },
              new Color { Id = Guid.Parse("bb000000-0000-0000-0000-000000000000"), Name = "Aperol", HexValue = "#FF5B49" },
              new Color { Id = Guid.Parse("cc000000-0000-0000-0000-000000000000"), Name = "Solrosgul", HexValue = "#F5C400" },
              new Color { Id = Guid.Parse("dd000000-0000-0000-0000-000000000000"), Name = "Gr\u00e4smatta", HexValue = "#39D353" },
              new Color { Id = Guid.Parse("ee000000-0000-0000-0000-000000000000"), Name = "Skogsgr\u00f6n", HexValue = "#00A86B" },
              new Color { Id = Guid.Parse("ff000000-0000-0000-0000-000000000000"), Name = "Lagun", HexValue = "#00BFA5" },
              new Color { Id = Guid.Parse("a1000000-0000-0000-0000-000000000000"), Name = "Laserstr\u00e5le", HexValue = "#00C8E0" },
              new Color { Id = Guid.Parse("b2000000-0000-0000-0000-000000000000"), Name = "Himmelsbl\u00e5", HexValue = "#2196F3" },
              new Color { Id = Guid.Parse("c3000000-0000-0000-0000-000000000000"), Name = "Kleinbl\u00e5", HexValue = "#4100F4" },
              new Color { Id = Guid.Parse("d4000000-0000-0000-0000-000000000000"), Name = "Lupin", HexValue = "#B050FF" },
              new Color { Id = Guid.Parse("e5000000-0000-0000-0000-000000000000"), Name = "Sp\u00e5rvagn 8", HexValue = "#9C27B0" },
              new Color { Id = Guid.Parse("f6000000-0000-0000-0000-000000000000"), Name = "Rosa", HexValue = "#F675C2" }
  );
    }
}
