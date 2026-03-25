using Microsoft.EntityFrameworkCore;
using Minigolf.Application.Interfaces;
using Minigolf.Domain.Models;
using Minigolf.Infrastructure.Data;

namespace Minigolf.Infrastructure.Persistance.Repositories;

public sealed class CourseRepository(AppDbContext db) : ICourseRepository
{

    public async Task<List<Course>> GetAllAsync()
    {
        return await db.Courses.ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(Guid id)
    {
        return await db.Courses
            .Include(c => c.Holes)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        db.Courses.Add(course);
        await db.SaveChangesAsync();
        return course;
    }
}