using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Minigolf.Application.Interfaces;
using Minigolf.Application.UseCases.Auth.LoginUser;
using Minigolf.Application.UseCases.Auth.RegisterUser;
using Minigolf.Application.UseCases.Courses.GetCourses;
using Minigolf.Application.UseCases.Courses.GetCoursesById;
using Minigolf.Application.UseCases.Friends.AcceptFriendRequest;
using Minigolf.Application.UseCases.Friends.GetFriends;
using Minigolf.Application.UseCases.Friends.RemoveFriend;
using Minigolf.Application.UseCases.Friends.SendFriendRequest;
using Minigolf.Application.UseCases.Users.GetCurrentUser;
using Minigolf.Application.UseCases.Users.GetUserByUsername;
using Minigolf.Infrastructure.Data;
using Minigolf.Infrastructure.Persistance.Repositories;
using Minigolf.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
      options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<RegisterUserHandler>();
builder.Services.AddScoped<LoginUserHandler>();
builder.Services.AddScoped<GetCurrentUserHandler>();
builder.Services.AddScoped<GetUserByUsernameHandler>();

builder.Services.AddScoped<IFriendshipRepository, FriendshipRepository>();
builder.Services.AddScoped<GetFriendsHandler>();
builder.Services.AddScoped<SendFriendRequestHandler>();
builder.Services.AddScoped<AcceptFriendRequestHandler>();
builder.Services.AddScoped<RemoveFriendHandler>();

builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<GetCoursesHandler>();
builder.Services.AddScoped<GetCoursesByIdHandler>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options =>
      {
          options.TokenValidationParameters = new TokenValidationParameters
          {
              ValidateIssuer = true,
              ValidateAudience = true,
              ValidateLifetime = true,
              ValidateIssuerSigningKey = true,
              ValidIssuer = builder.Configuration["Jwt:Issuer"],
              ValidAudience = builder.Configuration["Jwt:Audience"],
              IssuerSigningKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
          };
      });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
