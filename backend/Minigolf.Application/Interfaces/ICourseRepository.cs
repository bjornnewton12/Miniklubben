using Minigolf.Domain.Models;

namespace Minigolf.Application.Interfaces;

public interface ICourseRepository
{
    Task<List<Course>> GetAllAsync();
    Task<Course?> GetByIdAsync(Guid id);
    Task<Course> CreateAsync(Course course);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> RenameAsync(Guid id, string newName);
}