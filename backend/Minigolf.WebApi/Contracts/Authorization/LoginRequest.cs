namespace Minigolf.WebApi.Contracts.Authorization;

public sealed record LoginRequest(
    
    string Username,
    string Password
);
