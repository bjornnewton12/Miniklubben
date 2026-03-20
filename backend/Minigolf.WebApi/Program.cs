using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Minigolf.Application.Interfaces;
using Minigolf.Application.UseCases.Auth.LoginUser;
using Minigolf.Application.UseCases.Auth.RegisterUser;
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
