using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface IJwtService
{
    // Takes a User and returns a JWT token string
    string GenerateToken(User user);
}
