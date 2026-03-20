namespace Minigolf.Application.DTOs;

public sealed record AuthResponse(
    string Token,
    UserDto User
    );
